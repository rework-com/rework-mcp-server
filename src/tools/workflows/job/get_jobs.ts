import { reworkWorkflowFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for getting jobs
 */
import { z } from 'zod';

// Enum for job statuses based on the query conditions
export enum JobStatus {
    ACTIVE = 'active',    // status=0
    DONE = 'done',        // status=1
    FAILED = 'failed',    // review=1 and status=0
    OVERDUE = 'overdue',        // status=0 and (start_date > now or start_date=0)
}

// Define the Zod schema for creating a job
export const getJobsSchema = {
    q: z.string().optional().describe("Optional search query to filter jobs by name."),
    workflow_id: z.string().optional().describe("Optional ID of the workflow that the jobs belong to."),
    deadline_from: z.string().optional().describe("Optional deadline from. Supports Unix timestamps (seconds)"),
    deadline_to: z.string().optional().describe("Optional deadline to. Supports Unix timestamps (seconds)"),
    page: z.number().optional().describe("Optional page number. Defaults to 0, each page has 100 jobs"),
    
	created_from: z.string().optional().describe("Optional created from. Supports Unix timestamps (seconds)"),
	created_to: z.string().optional().describe("Optional created to. Supports Unix timestamps (seconds)"),

    creator_username: z.string().optional().describe("Optional username of the creator. This will be used to indicate the job creator."),
    username: z.string().optional().describe("Optional username of the assignee. This will be used to assign the job to the user."),
	status: z.enum([JobStatus.ACTIVE, JobStatus.DONE, JobStatus.FAILED, JobStatus.OVERDUE] as const).optional().describe("Optional status of the jobs. Can be one of: 'active' (not done), 'done', 'review' (In review process), 'todo' (not started), 'doing' (started), 'donelate' (completed after deadline), 'overdue' (not done and past deadline), 'notreview' (not in review), 'today' (due today)"),
};

export const getJobsTool = {
    name: "get_jobs",
    description: `
		Get jobs in the system. 
		Can filtered by q (query to filter job name), 
		deadline_from (Unix timestamp in seconds), deadline_to (Unix timestamp in seconds), 
		created_from (Unix timestamp in seconds), created_to (Unix timestamp in seconds), 
		page (page number), creator_username (username of creator), username (username of assignee), 
		q (query to filter job name), 
		workflow_id (ID of the workflow that the jobs belong to), 
		
		status (one of: 'active' (not done), 'done', 'failed', 'overdue'))
	`,
    inputSchema: getJobsSchema
};





/**
 * Handler for getting jobs
 */
export async function getJobsHandler(params: any) {
    const {
        q,
        workflow_id,
        deadline_from,
        deadline_to,
        created_from,
        created_to,
        page,
        creator_username,
        username,
        status
    } = params;


    // Prepare job data
    const jobData: Record<string, any> = {
        limit: 10
    };

    // Add optional fields if they exist
    if (q) jobData.q = q;
    if (workflow_id) jobData.workflow_id = workflow_id;
    if (deadline_from) jobData.deadline_from = deadline_from;
    if (deadline_to) jobData.deadline_to = deadline_to;
    if (created_from) jobData.created_from = created_from;
    if (created_to) jobData.created_to = created_to;
    if (page) jobData.page = page;
    if (creator_username) jobData.creator_username = creator_username;
    if (username) jobData.username = username;
    if (status) jobData.status = status;

    // Use the fetcher to create the job
    const data = await reworkWorkflowFetcher.request({
		endpoint: '/workflows/v1/jobs/get',
		data: jobData
	})

	let jobs = (data?.jobs || []);
	if (jobs.length > 30) {
		jobs = jobs.map((e: any) => {
			return {
				name: e.name,
				id: e.id,
				content: e.content,
				since: e.since,
				status: e.status,
				user_id: e.user_id,
				creator_id: e.creator_id,
				stage_export: e.stage_export,
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
		jobs
	});
}