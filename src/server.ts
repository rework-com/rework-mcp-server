/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * MCP Server for ClickUp integration
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import config from "./config.js";

import { Logger } from "./logger.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createTaskHandler, createTaskTool } from "./tools/projects/task/create_task.js";
import { getTasksHandler, getTasksTool } from "./tools/projects/task/get_tasks.js";
import { listAllUsersHandler, listAllUsersTool } from "./tools/system/user/list_all.js";
import { getProjectsHandler, getProjectsTool } from "./tools/projects/project/all.js";
import { getDetailTaskHandler, getDetailTaskTool } from "./tools/projects/task/get_detail_task.js";
import { findUsersHandler, findUsersTool } from "./tools/system/user/find_users.js";


// Create a logger instance for server
const logger = new Logger('Server');


const server = new McpServer({
  name: 'rework-mcp-server',
  version: '0.7.2',
});


server.resource('users', 'users', async (params: any) => {
	// Replace this with your actual data‐fetching logic:
	const users = await listAllUsersHandler(params)
	return users
});


/**
 * @desc Task tools
 */
server.tool(
  createTaskTool.name,
  createTaskTool.description,
  createTaskTool.inputSchema,
  async (params) => {
    return (await createTaskHandler(params)) as Tool;
  }
)

server.tool(
	getTasksTool.name,
	getTasksTool.description,
	getTasksTool.inputSchema,
	async (params) => {
	  return (await getTasksHandler(params)) as Tool;
	}
)

// /**
//  * @desc User tools
//  */
// server.tool(
// 	listAllUsersTool.name,
// 	listAllUsersTool.description,
// 	listAllUsersTool.inputSchema,
// 	async (params) => {
// 	  return (await listAllUsersHandler(params)) as Tool;
// 	}
// )

server.tool(
	findUsersTool.name,
	findUsersTool.description,
	findUsersTool.inputSchema,
	async (params) => {
	  return (await findUsersHandler(params)) as Tool;
	}
)

server.tool(
	getProjectsTool.name,
	getProjectsTool.description,
	getProjectsTool.inputSchema,
	async (params) => {
	  return (await getProjectsHandler(params)) as Tool;
	}
)


server.tool(
	getDetailTaskTool.name,
	getDetailTaskTool.description,
	getDetailTaskTool.inputSchema,
	async (params) => {
	  return (await getDetailTaskHandler(params)) as Tool;
	}
)


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Rework MCP Server running on stdio");
}


export function startStdioServer() {
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
}
