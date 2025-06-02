/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Task Utilities
 * 
 * This module provides utility functions for task-related operations including
 * data formatting, validation, and resolution of IDs from names.
 */

import { 
  ClickUpTask
} from '../../services/rework/types.js';
import { BatchProcessingOptions } from '../../utils/concurrency-utils.js';
import { formatDueDate } from '../utils.js';
import { clickUpServices } from '../../services/shared.js';
import { findListIDByName } from '../../tools/list.js';
import { WorkspaceService } from '../../services/rework/workspace.js';
import { TaskPriority } from '../../services/rework/types.js';

// Use shared services instance for ID resolution
const { workspace: workspaceService, task: taskService } = clickUpServices;

//=============================================================================
// DATA FORMATTING UTILITIES
//=============================================================================

/**
 * Formats task data for response
 */
export function formatTaskData(task: ClickUpTask, additional: any = {}) {
  return {
    id: task.id,
    custom_id: task.custom_id,
    name: task.name,
    text_content: task.text_content,
    description: task.description,
    url: task.url,
    status: task.status?.status || "Unknown",
    status_color: task.status?.color,
    orderindex: task.orderindex,
    date_created: task.date_created,
    date_updated: task.date_updated,
    date_closed: task.date_closed,
    creator: task.creator,
    assignees: task.assignees,
    watchers: task.watchers,
    checklists: task.checklists,
    tags: task.tags,
    parent: task.parent,
    priority: task.priority,
    due_date: task.due_date ? formatDueDate(Number(task.due_date)) : undefined,
    start_date: task.start_date ? formatDueDate(Number(task.start_date)) : undefined,
    time_estimate: task.time_estimate,
    time_spent: task.time_spent,
    custom_fields: task.custom_fields,
    dependencies: task.dependencies,
    linked_tasks: task.linked_tasks,
    team_id: task.team_id,
    list: {
      id: task.list.id,
      name: task.list.name,
      access: task.list.access
    },
    folder: task.folder ? {
      id: task.folder.id,
      name: task.folder.name,
      hidden: task.folder.hidden,
      access: task.folder.access
    } : null,
    space: {
      id: task.space.id,
      name: task.space.name
    },
    ...additional
  };
}

//=============================================================================
// VALIDATION UTILITIES
//=============================================================================

/**
 * Task identification parameters
 */
export interface TaskIdentificationParams {
  taskId?: string;
  taskName?: string;
  listName?: string;
  customTaskId?: string;
}

/**
 * Task validation result
 */
export interface TaskValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Options for task identification validation
 */
export interface TaskIdentificationValidationOptions {
  requireTaskId?: boolean;
  useGlobalLookup?: boolean;
}

/**
 * Validates task identification parameters
 * 
 * @param params - Task identification parameters
 * @param options - Validation options
 * @returns Validation result with error message if any
 */
export function validateTaskIdentification(
  params: TaskIdentificationParams,
  options: TaskIdentificationValidationOptions = {}
): TaskValidationResult {
  const { 
    taskId, 
    taskName, 
    customTaskId,
    listName
  } = params;
  
  const { 
    requireTaskId = false,
    useGlobalLookup = true
  } = options;

  // If taskId is required, it must be provided
  if (requireTaskId && !taskId) {
    return {
      isValid: false,
      errorMessage: 'Task ID is required for this operation'
    };
  }

  // At least one identification method must be provided
  if (!taskId && !taskName && !customTaskId) {
    return {
      isValid: false,
      errorMessage: 'Either taskId, taskName, or customTaskId must be provided to identify the task'
    };
  }

  // When using taskName without global lookup, listName is required
  if (taskName && !taskId && !customTaskId && !useGlobalLookup && !listName) {
    return {
      isValid: false,
      errorMessage: 'When identifying a task by name, you must also provide the listName parameter'
    };
  }

  return { isValid: true };
}

/**
 * Validates list identification parameters
 * Ensures either listId or listName is provided
 */
export function validateListIdentification(listId?: string, listName?: string): void {
  if (!listId && !listName) {
    throw new Error("Either listId or listName must be provided");
  }
}

/**
 * Validates task update data
 * Ensures at least one update field is provided
 */
export function validateTaskUpdateData(updateData: any): void {
  // Validate custom_fields if provided
  if (updateData.custom_fields) {
    if (!Array.isArray(updateData.custom_fields)) {
      throw new Error("custom_fields must be an array");
    }
    
    for (const field of updateData.custom_fields) {
      if (!field.id || field.value === undefined) {
        throw new Error("Each custom field must have both id and value properties");
      }
    }
  }
  
  // Ensure there's at least one field to update
  if (Object.keys(updateData).length === 0) {
    throw new Error("At least one field to update must be provided");
  }
}

/**
 * Validate bulk task array and task identification
 * @param tasks Array of tasks to validate
 * @param operation The bulk operation type ('create', 'update', 'move', 'delete')
 */
export function validateBulkTasks(tasks: any[], operation: 'create' | 'update' | 'move' | 'delete' = 'update') {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error("tasks must be a non-empty array");
  }

  tasks.forEach((task, index) => {
    if (!task || typeof task !== 'object') {
      throw new Error(`Task at index ${index} must be an object`);
    }

    // Skip task identification validation for create operations
    if (operation === 'create') {
      return;
    }

    // For bulk operations, require listName when using taskName
    if (task.taskName && !task.listName) {
      throw new Error(`Task at index ${index} using taskName must also provide listName`);
    }

    // At least one identifier is required for non-create operations
    if (!task.taskId && !task.taskName && !task.customTaskId) {
      throw new Error(`Task at index ${index} must provide either taskId, taskName + listName, or customTaskId`);
    }
  });
}

/**
 * Parse options for bulk operations
 */
export function parseBulkOptions(rawOptions: any): BatchProcessingOptions | undefined {
  if (typeof rawOptions === 'string') {
    try {
      return JSON.parse(rawOptions);
    } catch (error) {
      return undefined;
    }
  }
  return rawOptions;
}

//=============================================================================
// ID DETECTION UTILITIES
//=============================================================================

/**
 * Determines if an ID is a custom ID based on its format
 * Custom IDs typically have an uppercase prefix followed by a hyphen and number (e.g., DEV-1234)
 * Regular task IDs are always 9 characters long
 * 
 * @param id The task ID to check
 * @returns True if the ID appears to be a custom ID
 */
export function isCustomTaskId(id: string): boolean {
  if (!id) return false;
  
  // Regular task IDs are exactly 9 characters
  if (id.length === 9) {
    return false;
  }
  
  // Custom IDs have an uppercase prefix followed by a hyphen and numbers
  const customIdPattern = /^[A-Z]+-\d+$/;
  return customIdPattern.test(id);
}

/**
 * Resolves a list ID from either direct ID or name
 * Handles validation and throws appropriate errors
 */
export async function resolveListIdWithValidation(listId?: string, listName?: string): Promise<string> {
  // Validate parameters
  validateListIdentification(listId, listName);
  
  // If listId is provided, use it directly
  if (listId) return listId;
  
  // At this point we know we have listName (validation ensures this)
  const listInfo = await findListIDByName(workspaceService, listName!);
  
  if (!listInfo) {
    throw new Error(`List "${listName}" not found`);
  }
  
  return listInfo.id;
}

//=============================================================================
// PATH EXTRACTION HELPER FUNCTIONS
//=============================================================================

/**
 * Extract path from node to root
 */
export function extractPath(node: any): string {
  if (!node) return '';
  if (!node.parent) return node.name;
  return `${extractPath(node.parent)} > ${node.name}`;
}

/**
 * Extract path from root to a specific node
 */
export function extractTreePath(root: any, targetId: string): any[] {
  if (!root) return [];
  
  // If this node is the target, return it in an array
  if (root.id === targetId) {
    return [root];
  }
  
  // Check children if they exist
  if (root.children) {
    for (const child of root.children) {
      const path = extractTreePath(child, targetId);
      if (path.length > 0) {
        return [root, ...path];
      }
    }
  }
  
  // Not found in this branch
  return [];
}

/**
 * Get task ID from various identification methods
 */
export async function getTaskId(
  taskId?: string,
  taskName?: string,
  listName?: string,
  customTaskId?: string,
  requireId = false
): Promise<string> {
  // Validate task identification
  const validationResult = validateTaskIdentification(
    { taskId, taskName, listName, customTaskId },
    { requireTaskId: requireId, useGlobalLookup: true }
  );
  
  if (!validationResult.isValid) {
    throw new Error(validationResult.errorMessage);
  }

  try {
    const result = await taskService.findTasks({
      taskId,
      customTaskId,
      taskName,
      listName,
      allowMultipleMatches: false,
      useSmartDisambiguation: true,
      includeFullDetails: false
    });

    if (!result || Array.isArray(result)) {
      throw new Error(`Task not found with the provided identification`);
    }

    return result.id;
  } catch (error) {
    if (error.message.includes('Multiple tasks found')) {
      throw new Error(`Multiple tasks found with name "${taskName}". Please provide list name to disambiguate.`);
    }
    throw error;
  }
} 