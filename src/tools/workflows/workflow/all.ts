import { reworkWorkflowFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';
import { isNameMatch } from '../../../utils/resolver-util.js';

/**
 * Tool definition for getting projects
 */
import { z } from 'zod';



// Define the Zod schema for creating a task
export const getWorkflowsSchema = {
    q: z.string().optional().describe("Optional search query to filter workflows by name."),
	page: z.number().optional().default(0).describe("Optional page number. Defaults to 0, each page has 20 workflows"),
};

export const getWorkflowsTool = {
    name: "get_workflows",
    description: `Get workflows. Can filtered by q. Each workflow contain a list of stages`,
    inputSchema: getWorkflowsSchema
};





/**
 * Handler for getting projects
 */
export async function getWorkflowsHandler(params: any) {
    const {
        q, page
    } = params;


    // Prepare project data
    const workflowData: Record<string, any> = {
        
    };

    // Add optional fields if they exist
    if (q) workflowData.q = q;
    if (page) workflowData.page = page;

    // Use the fetcher to get the projects
    const data = await reworkWorkflowFetcher.request({
		endpoint: '/workflows/v1/workflows/get',
		data: workflowData
	})
	

	let workflows = (data?.workflows || []).map((e: any) => ({
		name: e.name,
		id: e.id,
		content: e.content,
		fields: (e.input_model?.fields || []),
		stages: (e.execution_model?.stages || []).map((s: any) => ({
			name: s.name,
			id: s.id,
			metatype: s.metatype
		})),
		score: isNameMatch(e.name, q).score
	})).filter((e: any) => isNameMatch(e.name, q).isMatch).sort((a: any, b: any) => b.score - a.score);

    return Responder.createResponse({
		...data,
		workflows
	});
}