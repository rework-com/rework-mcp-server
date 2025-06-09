import { reworkProjectFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single task
 */
import { z } from 'zod';

// Define the Zod schema for creating a task
export const createTaskSchema = {
    name: z.string().describe("REQUIRED: Name of the task. Put a relevant emoji followed by a blank space before the name."),
    board_id: z.string().describe("REQUIRED: ID of the board to create the task in."),
    content: z.string().optional().describe("Optional html formatted description for the task"),
    deadline: z.string().optional().describe("Optional deadline. Supports Unix timestamps (seconds)"),
    start_date: z.string().optional().describe("Optional start date. Supports Unix timestamps (seconds)"),
    creator_username: z.string().describe("REQUIRED: Username of the creator. This will be used to indicate the task creator."),
    user_id: z.string().optional().describe("Optional user ID of the assignee. This will be used to assign the task to the user."),
    parent_id: z.string().optional().describe("Optional ID of the parent task. When specified, this task will be created as a subtask of the specified parent task."),
    tags: z.array(z.string()).optional().describe("Optional array of tag names to assign to the task. The tags must already exist in the space."),
    custom_fields: z.array(
        z.object({
            code: z.string().describe("Code of the custom field"),
            value: z.any().describe("Value for the custom field. Type depends on the field type.")
        })
    ).optional().describe("Optional array of custom field values to set on the task. Each object must have an 'id' and 'value' property.")
};

export const createTaskTool = {
    name: "create_task",
    description: `
		Creates a single task in a Project board. Use board_id.
		Required: name + board_id. Supports custom fields as array of {code, value}.
	`,
    inputSchema: createTaskSchema
};





/**
 * Handler for creating a task
 */
export async function createTaskHandler(params: any) {
    const {
        name,
        board_id,
        content,
        deadline,
        start_date,
        parent_id,
        tags,
        custom_fields,
        creator_username,
        user_id
    } = params;

    if (!name) throw new Error("Task name is required");
    if (!board_id) throw new Error("Board ID is required");

    // Prepare task data
    const taskData: Record<string, any> = {
        name,
        board_id
    };

    // Add optional fields if they exist
    if (content) taskData.content = content;
    if (deadline) taskData.deadline = deadline;
    if (start_date) taskData.start_date = start_date;
    if (parent_id) taskData.parent_id = parent_id;
	if (tags && Array.isArray(tags)) taskData.tags = tags.join(',');
    if (custom_fields && Array.isArray(custom_fields)) {
		for (const custom_field of custom_fields) {
			taskData[custom_field.code] = custom_field.value;
		}
	}
    if (user_id) taskData.user_id = user_id;
    if (creator_username) taskData.creator_username = creator_username;

    // Use the fetcher to create the task
    const data = await reworkProjectFetcher.createTask(taskData);

    return Responder.createResponse(data);
}