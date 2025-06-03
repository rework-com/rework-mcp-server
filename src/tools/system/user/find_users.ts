import { reworkAccountFetcher } from '../../../utils/api/fetcher.js';
import { isNameMatch } from '../../../utils/resolver-util.js';
import Responder from '../../../utils/responder.js';

/**
 * Tool definition for creating a single task
 */
import { z } from 'zod';


// Define the Zod schema for creating a task
export const findUsersSchema = {
	properties: z.enum(['all', 'active', 'inactive']).describe("Required properties, 'all' for all users, 'active' for active users, 'inactive' for inactive users"),
	q: z.string().optional().describe("Optional search query to filter users by name.")
};

export const findUsersTool = {
    name: "find_users",
    description: `
		Find users from of Rework, returns an array of users contains username, id, name, score (0-100, higher is better). 
		Every question about user (assignee, creator, etc.) should use this tool first to get username and user id and put it into the params if needed
		If you want an user, and not found any one yet, take the closest match.
		`,
    inputSchema: findUsersSchema
};





/**
 * Handler for creating a task
 */
export async function findUsersHandler(params: any) {
    const { q } = params;
    // Use the fetcher to create the task
    const data = await reworkAccountFetcher.request({
		endpoint: '/account/v1/user/all',
		data: { q }
	})

    const users = (data.users || []).map((e: any) => ({
        name: e.name,
        id: e.id,
        username: e.username,
		score: isNameMatch(e.name, q).score
    })).filter((e: any) => isNameMatch(e.name, q).isMatch).sort((a: any, b: any) => b.score - a.score);

    return Responder.createResponse(users);
}