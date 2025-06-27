import { reworkProjectFetcher } from '../../../utils/api/fetcher.js';
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
export const getTasksSchema = {
    q: z.string().optional().describe("Optional search query to filter tasks by name."),
    board_id: z.string().optional().describe("Optional ID of the board that the tasks belong to."),
	project_id: z.string().optional().describe("Optional ID of the project that the tasks belong to."),
    deadline_from: z.string().optional().describe("Optional deadline from. Supports Unix timestamps (seconds)"),
    deadline_to: z.string().optional().describe("Optional deadline to. Supports Unix timestamps (seconds)"),
    page: z.number().optional().describe("Optional page number. Defaults to 0, each page has 100 tasks"),
    
	created_from: z.string().optional().describe("Optional created from. Supports Unix timestamps (seconds)"),
	created_to: z.string().optional().describe("Optional created to. Supports Unix timestamps (seconds)"),

    creator: z.string().optional().describe("Optional username of the creator. This will be used to indicate the task creator."),
    assign: z.string().optional().describe("Optional user ID of the assignee. This will be used to assign the task to the user."),
	status: z.enum([TaskStatus.ACTIVE, TaskStatus.DONE, TaskStatus.REVIEW, TaskStatus.TODO, TaskStatus.DOING, TaskStatus.DONELATE, TaskStatus.OVERDUE, TaskStatus.NOTREVIEW, TaskStatus.TODAY] as const).optional().describe("Optional status of the tasks. Can be one of: 'active' (not done), 'done', 'review' (In review process), 'todo' (not started), 'doing' (started), 'donelate' (completed after deadline), 'overdue' (not done and past deadline), 'notreview' (not in review), 'today' (due today)"),
};

export const getTasksTool = {
    name: "get_tasks",
    description: `
		Get tasks from a all boards. 
		Can filtered by q (query to filter task name), board_id, project_id, 
		deadline_from (Unix timestamp in seconds), deadline_to (Unix timestamp in seconds), 
		created_from (Unix timestamp in seconds), created_to (Unix timestamp in seconds), 
		page (page number), creator (user id of creator), assign (user id of assignee), 
		status (one of: 'active' (not done), 'done', 'review' (In review process), 'todo' (not started), 'doing' (started), 'donelate' (completed after deadline), 'overdue' (not done and past deadline), 'notreview' (not in review), 'today' (due today))
	`,
    inputSchema: getTasksSchema
};





/**
 * Handler for creating a task
 */
export async function getTasksHandler(params: any) {
    const {
        q,
        board_id,
        project_id,
        deadline_from,
        deadline_to,
        created_from,
        created_to,
        page,
        creator,
        assign,
        status
    } = params;


    // Prepare task data
    const taskData: Record<string, any> = {
        limit: 10
    };

    // Add optional fields if they exist
    if (q) taskData.q = q;
    if (board_id) taskData.board_id = board_id;
    if (project_id) taskData.project_id = project_id;
    if (deadline_from) taskData.deadline_from = deadline_from;
    if (deadline_to) taskData.deadline_to = deadline_to;
    if (created_from) taskData.created_from = created_from;
    if (created_to) taskData.created_to = created_to;
    if (page) taskData.page = page;
    if (creator) taskData.creator = creator;
    if (assign) taskData.assign = assign;
    if (status) taskData.status = status;

    // Use the fetcher to create the task
    const data = await reworkProjectFetcher.request({
		endpoint: '/projects/v1/task/list',
		data: taskData
	})

	let tasks = (data?.tasks || []);
	if (tasks.length > 30) {
		tasks = tasks.map((e: any) => {
			return {
				name: e.name,
				id: e.id,
				content: e.content,
				since: e.since,
				status: e.status,
				user_id: e.user_id,
				creator_id: e.creator_id,
				board_export: e.board_export,
				project_export: e.project_export,
				result: e.result,
				deadline: e.deadline, 
				last_update: e.last_update,
				custom_fields: (e.form || []).map((f: any) => ({
					name: f.name,
					id: f.id,
					type: f.type,
					value: f.display
				})),
			}
		})
	}
		

    return Responder.createResponse({
		...data,
		tasks
	});
}