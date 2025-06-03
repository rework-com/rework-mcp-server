import { reworkProjectFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single task
 */
import { z } from 'zod';


// Define the Zod schema for creating a task
export const getDetailTaskSchema = {
    id: z.string().describe("Required ID of the task.")
};

export const getDetailTaskTool = {
    name: "get_detail_task",
    description: `Get detail of a task by ID of task`,
    inputSchema: getDetailTaskSchema
};





/**
 * Handler for creating a task
 */
export async function getDetailTaskHandler(params: any) {
    const {
        id,
    } = params;


    if (!id) throw new Error("Task ID is required");

    // Prepare task data
    const taskData: Record<string, any> = {
        id
    };

    // Use the fetcher to create the task
    const data = await reworkProjectFetcher.request({
		endpoint: '/projects/v1/task/get',
		data: taskData
	})
		
    return Responder.createResponse(data);
}