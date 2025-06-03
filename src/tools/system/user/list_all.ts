import { reworkAccountFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single task
 */
import { z } from 'zod';

// Enum for task statuses based on the query conditions
export enum TaskStatus {
    ACTIVE = 'active',    // status=0
    DONE = 'done',        // status=1
    REVIEW = 'review',    // review=1 and status=0
    TODO = 'todo',        // status=0 and (start_date > now or start_date=0)
    DOING = 'doing',      // status=0 and start_date < now and start_date > 0
    DONELATE = 'donelate', // status=1 and deadline > 0 and completed_time > deadline
    OVERDUE = 'overdue',  // status=0 and deadline > 0 and deadline < now
    NOTREVIEW = 'notreview', // review=0 and status=0
    TODAY = 'today'       // status=0 and deadline is today
}

// Define the Zod schema for creating a task
export const listAllUsersSchema = {
};

export const listAllUsersTool = {
    name: "list_all_users",
    description: `Get all users from of Rework`,
    inputSchema: listAllUsersSchema
};





/**
 * Handler for creating a task
 */
export async function listAllUsersHandler(params: any) {
    const {} = params;
    // Use the fetcher to create the task
    const data = await reworkAccountFetcher.request({
		endpoint: '/account/v1/user/all',
		data: {}
	})

    // const users = (data.users || []).map((e: any) => ({
    //     name: e.name,
    //     id: e.id,
    //     username: e.username
    // }))

    return Responder.createResponse(data);
}