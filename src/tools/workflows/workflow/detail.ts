import { reworkWorkflowFetcher } from '../../../utils/api/fetcher.js';
import Responder from '../../../utils/responder.js';
import { isNameMatch } from '../../../utils/resolver-util.js';

/**
 * Tool definition for getting projects
 */
import { z } from 'zod';



// Define the Zod schema for creating a task
export const getWorkflowSchema = {
    id: z.string().optional().describe("Optional search query to filter workflows by name."),
};

export const getWorkflowTool = {
    name: "get_workflow",
    description: `
		Get detail of a workflow. In workflow detail contain a list of stages and list of fields that used to create job
		In each field, it contains: 
			- name: name of the field
			- code: code of the field
			- type: type of the field
			- required: true if the field is required
			- options: options of the field
			- placeholder: description of the field
	`,
    inputSchema: getWorkflowSchema
};





/**
 * Handler for getting projects
 */
export async function getWorkflowHandler(params: any) {
    const {
        id
    } = params;


    // Prepare project data
    const workflowData: Record<string, any> = {
        
    };

    // Add optional fields if they exist
    if (id) workflowData.id = id;

    // Use the fetcher to get the projects
    const data = await reworkWorkflowFetcher.request({
		endpoint: '/workflows/v1/workflow/get',
		data: workflowData
	})

	let workflow = {
		name: data?.workflow?.name,
		id: data?.workflow?.id,
		content: data?.workflow?.content,
		fields: (data?.workflow?.input_model?.fields || []).map((f: any) => ({
			name: f.name,
			code: f.code,
			type: f.type,
			required: f.attrs?.required,
			options: f.data?.options,
			placeholder: f.data?.placeholder
		})),
		stages: (data?.workflow?.execution_model?.stages || []).map((s: any) => ({
			name: s.name,
			id: s.id,
			metatype: s.metatype
		})),
	};

	let stages = (data?.stages || []).map((s: any) => ({
		name: s.name,
		id: s.id,
		metatype: s.metatype
	}));

    return Responder.createResponse({
		...data,
		workflow,
		stages
	});
}