/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Single Task Operations
 * 
 * This module defines tools for single task operations including creating,
 * updating, moving, duplicating, and deleting tasks, as well as retrieving
 * task details and comments.
 */

import { reworkServices } from '../../services/shared.js';
import { 
  formatTaskData,
  resolveListIdWithValidation,
  validateTaskUpdateData,
  validateTaskIdentification,
  validateListIdentification
} from './utilities.js';

// Use shared services instance
const { task: taskService } = reworkServices;

//=============================================================================
// COMMON VALIDATION UTILITIES
//=============================================================================

// Common validation functions
const validateTaskName = (name: string) => {
  if (!name || typeof name !== 'string') {
    throw new Error("A task name is required");
  }

  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new Error("Task name cannot be empty or only whitespace");
  }
  return trimmedName;
};

const validatePriority = (priority?: number) => {
  if (priority !== undefined && (typeof priority !== 'number' || priority < 1 || priority > 4)) {
    throw new Error("Priority must be a number between 1 and 4");
  }
};

const validateDueDate = (dueDate?: string) => {
  if (dueDate && typeof dueDate !== 'string') {
    throw new Error("Due date must be a string in timestamp format or natural language");
  }
};

// Common error handler
const handleOperationError = (operation: string, error: any) => {
  console.error(`Error ${operation}:`, error);
  throw error;
};

//=============================================================================
// SINGLE TASK OPERATION TOOLS
//=============================================================================

/**
 * Tool definition for creating a single task
 */
export const createTaskTool = {
  name: "create_task",
  description: `Creates a single task in a Rework project board. Use boardId (preferred). Required: name + boardId. For multiple tasks use create_bulk_tasks. Can create subtasks via parent param. Supports custom fields as array of {id, value}.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "REQUIRED: Name of the task. Put a relevant emoji followed by a blank space before the name."
      },
      boardId: {
        type: "string",
        description: "REQUIRED: ID of the board to create the task in."
      },
      content: {
        type: "string",
        description: "Optional html text description for the task"
      },
      
      deadline: {
        type: "string",
        description: "Optional due date. Supports Unix timestamps (seconds) or time format like '2025-06-02 15:00', etc."
      },
      start_date: {
        type: "string",
        description: "Optional start date. Supports Unix timestamps (seconds) or time format like '2025-06-02 15:00', etc."
      },
      parent_id: {
        type: "string",
        description: "Optional ID of the parent task. When specified, this task will be created as a subtask of the specified parent task."
      },
      custom_fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the custom field"
            },
            value: {
              description: "Value for the custom field. Type depends on the field type."
            }
          },
          required: ["id", "value"]
        },
        description: "Optional array of custom field values to set on the task. Each object must have an 'id' and 'value' property."
      }
    }
  }
};


/**
 * Tool definition for retrieving task details
 */
export const getTaskTool = {
  name: "get_task",
  description: `Gets task details by taskId (works with regular/custom IDs) or taskName. For taskName search, provide listName for faster lookup. Set subtasks=true to include all subtask details.`,
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "ID of task to retrieve (preferred). Works with integer format only."
      }
    }
  }
};

/**
 * Tool definition for retrieving tasks from a board
 */
export const getTasksTool = {
  name: "get_tasks",
  description: `Purpose: Retrieve tasks from a board with optional filtering.

Valid Usage:
1. Use board_id (preferred)

Requirements:
- board_id is REQUIRED

Notes:
- Use filters (archived, statuses, etc.) to narrow down results
- Pagination available through page parameter
- Sorting available through order_by and reverse parameters`,
  inputSchema: {
    type: "object",
    properties: {
      board_id: {
        type: "number",
        description: "ID of board to get tasks from (preferred). Works with integer format only."
      },
      q: {
        type: "string",
        description: "Search query"
      },
      page: {
        type: "number",
        description: "Page number for pagination (starts at 0)"
      },
    },
    required: []
  }
};