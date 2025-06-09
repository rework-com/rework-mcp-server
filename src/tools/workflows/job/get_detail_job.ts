import { reworkWorkflowFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single job
 */
import { z } from 'zod';


// Define the Zod schema for creating a job
export const getDetailJobSchema = {
    id: z.string().describe("Required ID of the job.")
};

export const getDetailJobTool = {
    name: "get_detail_job",
    description: `Get detail of a job by ID of job`,
    inputSchema: getDetailJobSchema
};





/**
 * Handler for creating a job
 */
export async function getDetailJobHandler(params: any) {
    const {
        id,
    } = params;


    if (!id) throw new Error("Job ID is required");

    // Prepare job data
    const jobData: Record<string, any> = {
        id
    };

    // Use the fetcher to create the job
    const data = await reworkWorkflowFetcher.request({
		endpoint: '/workflows/v1/job/get',
		data: jobData
	})
		
    return Responder.createResponse(data);
}