import { reworkWorkflowFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single job
 */
import { z } from 'zod';

// Define the Zod schema for creating a job
export const createJobSchema = {
    name: z.string().describe("REQUIRED: Name of the job. Put a relevant emoji followed by a blank space before the name."),
    workflow_id: z.string().describe("REQUIRED: ID of the workflow to create the job in."),
    content: z.string().optional().describe("Optional html formatted description for the job"),
    deadline: z.string().optional().describe("Optional deadline. Supports Unix timestamps (seconds)"),
    creator_username: z.string().describe("REQUIRED: Username of the creator. This will be used to indicate the job creator."),
    user_id: z.string().optional().describe("Optional user ID of the assignee. This will be used to assign the job to the user."),
    tags: z.array(z.string()).optional().describe("Optional array of tag names to assign to the job. The tags must already exist in the space."),
    custom_fields: z.array(
        z.object({
            code: z.string().describe("Code of the custom field"),
            value: z.any().describe(`
				Value for the custom field. Type depends on the field type.
				If the type is 'date' or 'datetime' the value should be a Unix timestamp (seconds).
			`)
        })
    ).optional().describe("Optional array of custom field values to set on the job. Each object must have an 'id' and 'value' property.")
};

export const createJobTool = {
    name: "create_job",
    description: `
		Creates a single job in a Workflow. Use workflow_id.
		Required: name + workflow_id. Supports custom fields as array of {id, value}.
	`,
    inputSchema: createJobSchema
};





/**
 * Handler for creating a job
 */
export async function createJobHandler(params: any) {
    const {
        name,
        workflow_id,
        content,
        deadline,
        tags,
        custom_fields,
        creator_username,
        user_id
    } = params;

    if (!name) throw new Error("Job name is required");
    if (!workflow_id) throw new Error("Workflow ID is required");

    // Prepare job data
    const jobData: Record<string, any> = {
        name,
        workflow_id
    };

    // Add optional fields if they exist
    if (content) jobData.content = content;
    if (deadline) jobData.deadline = deadline;
    if (tags && Array.isArray(tags)) jobData.tags = tags;
    if (custom_fields && Array.isArray(custom_fields)) jobData.custom_fields = custom_fields;
    if (user_id) jobData.user_id = user_id;
    if (creator_username) jobData.creator_username = creator_username;

    // Use the fetcher to create the job
    const data = await reworkWorkflowFetcher.request({
		endpoint: '/workflows/v1/job/create',
		data: jobData
	})

    return Responder.createResponse(data);
}