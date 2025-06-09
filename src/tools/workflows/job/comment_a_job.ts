import { reworkWorkflowFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single job
 */
import { z } from 'zod';


// Define the Zod schema for creating a job
export const commentJobSchema = {
    id: z.string().describe("Required ID of the job."),
	content: z.string().describe("Required content of the comment."),
	creator_username: z.string().describe("Required username of the creator.")
};

export const commentJobTool = {
    name: "comment_job",
    description: `Comment on a job by ID of job`,
    inputSchema: commentJobSchema
};





/**
 * Handler for creating a job
 */
export async function commentJobHandler(params: any) {
    const {
        id,
		content,
		creator_username
    } = params;


    if (!id) throw new Error("Job ID is required");
	if (!content) throw new Error("Content is required");
	if (!creator_username) throw new Error("Creator username is required");

    // Prepare job data
    const jobData: Record<string, any> = {
        id,
		content,
		creator_username
    };

    // Use the fetcher to create the job
    const data = await reworkWorkflowFetcher.request({
		endpoint: '/workflows/v1/job/post/create',
		data: jobData
	})
		
    return Responder.createResponse(data);
}