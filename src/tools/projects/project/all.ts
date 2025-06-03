import { reworkProjectFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for getting projects
 */
import { z } from 'zod';



// Define the Zod schema for creating a task
export const getProjectsSchema = {
    q: z.string().optional().describe("Optional search query to filter projects by name."),
	page: z.number().optional().default(0).describe("Optional page number. Defaults to 0, each page has 20 projects"),
};

export const getProjectsTool = {
    name: "get_projects",
    description: `Get projects. Can filtered by q. Each project contains list of boards with metatype tasks or docs. Tasks board will contains list of tasks`,
    inputSchema: getProjectsSchema
};





/**
 * Handler for getting projects
 */
export async function getProjectsHandler(params: any) {
    const {
        q, page
    } = params;


    // Prepare project data
    const projectData: Record<string, any> = {
        
    };

    // Add optional fields if they exist
    if (q) projectData.q = q;
    if (page) projectData.page = page;

    // Use the fetcher to get the projects
    const data = await reworkProjectFetcher.request({
		endpoint: '/projects/v1/project/all',
		data: projectData
	})

	const projects = (data?.projects || []).map((e: any) => ({
		name: e.name,
		id: e.id,
		content: e.content,
		boards: e.cached_boards.map((b: any) => ({
			name: b.name,
			id: b.id,
			metatype: b.metatype
		}))
	}))

    return Responder.createResponse({
		...data,
		projects
	});
}