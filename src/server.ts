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
import { createJobHandler, createJobTool } from "./tools/workflows/job/create_job.js";
import { getJobsHandler, getJobsTool } from "./tools/workflows/job/get_jobs.js";
import { getDetailJobHandler, getDetailJobTool } from "./tools/workflows/job/get_detail_job.js";
import { getWorkflowsHandler, getWorkflowsTool } from "./tools/workflows/workflow/all.js";


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
 * @desc Projects tools
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


server.tool(
	getDetailTaskTool.name,
	getDetailTaskTool.description,
	getDetailTaskTool.inputSchema,
	async (params) => {
	  return (await getDetailTaskHandler(params)) as Tool;
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

/**
 * @desc Jobs tools
 */
server.tool(
	createJobTool.name,
	createJobTool.description,
	createJobTool.inputSchema,
	async (params) => {
	  return (await createJobHandler(params)) as Tool;
	}
  )
  
  server.tool(
	  getJobsTool.name,
	  getJobsTool.description,
	  getJobsTool.inputSchema,
	  async (params) => {
		return (await getJobsHandler(params)) as Tool;
	  }
  )
  
  
  server.tool(
	  getDetailJobTool.name,
	  getDetailJobTool.description,
	  getDetailJobTool.inputSchema,
	  async (params) => {
		return (await getDetailJobHandler(params)) as Tool;
	  }
  )
  
  server.tool(
	  getWorkflowsTool.name,
	  getWorkflowsTool.description,
	  getWorkflowsTool.inputSchema,
	  async (params) => {
		return (await getWorkflowsHandler(params)) as Tool;
	  }
  )

/**
 * @desc User tools
 */
server.tool(
	findUsersTool.name,
	findUsersTool.description,
	findUsersTool.inputSchema,
	async (params) => {
	  return (await findUsersHandler(params)) as Tool;
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
