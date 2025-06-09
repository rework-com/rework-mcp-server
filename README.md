# Rework MCP Server

![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-brightgreen.svg)
![Version](https://img.shields.io/badge/Version-1.1.0-blue)

A Model Context Protocol (MCP) server for integrating Rework platform with AI applications. This server allows AI agents to interact with Rework projects, tasks, workflows, and jobs through a standardized protocol.

> 🚀 **Status Update:** v1.1.0 now available with complete project management and workflow support.

## Setup

1. Get your Rework credentials:
   - API key from Rework platform settings
   - Workspace information from your Rework account
2. Configure the MCP server with your credentials
3. Use natural language to manage your projects and workflows!

## Installation

Add this entry to your client's MCP settings JSON file:

```json
{
  "mcpServers": {
    "Rework": {
      "command": "npx",
      "args": [
       "-y",
	   "rework-mcp-server"
      ],
      "env": {
        "REWORK_PROJECT_ACCESS_TOKEN": "",
        "REWORK_PROJECT_PASSWORD": "",

        "REWORK_WORKFLOW_ACCESS_TOKEN": "",
        "REWORK_WORKFLOW_PASSWORD": "",

        "REWORK_ACCOUNT_ACCESS_TOKEN": "",
        "REWORK_ACCOUNT_PASSWORD": ""
      }
    }
  }
}
```

Alternatively, you can run the server directly using Node:

```bash
node index.js --env REWORK_PROJECT_ACCESS_TOKEN=your-project-access-token --env REWORK_PROJECT_PASSWORD=your-project-password --env REWORK_WORKFLOW_ACCESS_TOKEN=your-workflow-access-token --env REWORK_WORKFLOW_PASSWORD=your-workflow-password --env REWORK_ACCOUNT_ACCESS_TOKEN=your-account-access-token --env REWORK_ACCOUNT_PASSWORD=your-account-password
```

You can use the `DISABLED_TOOLS` environment variable to disable specific tools. Provide a comma-separated list of tool names to disable (e.g., `create_task,get_tasks`).

Disable tools you don't need if you are experiencing issues with the number of tools or any context limitations.

## Running with SSE Support

The server can be run in SSE (Server-Sent Events) mode by setting the following environment variables:

```json
{
  "mcpServers": {
    "Rework": {
      "command": "node",
      "args": [
        "index.js"
      ],
      "env": {
        "REWORK_PROJECT_ACCESS_TOKEN": "your-project-access-token",
        "REWORK_PROJECT_PASSWORD": "your-project-password",
        "REWORK_WORKFLOW_ACCESS_TOKEN": "your-workflow-access-token",
        "REWORK_WORKFLOW_PASSWORD": "your-workflow-password",
        "REWORK_ACCOUNT_ACCESS_TOKEN": "your-account-access-token",
        "REWORK_ACCOUNT_PASSWORD": "your-account-password",
        "ENABLE_SSE": "true",
        "PORT": "8000"  // Optional, defaults to 3000
      }
    }
  }
}
```

Or via command line:

```bash
node index.js --env REWORK_PROJECT_ACCESS_TOKEN=your-project-access-token --env REWORK_PROJECT_PASSWORD=your-project-password --env REWORK_WORKFLOW_ACCESS_TOKEN=your-workflow-access-token --env REWORK_WORKFLOW_PASSWORD=your-workflow-password --env REWORK_ACCOUNT_ACCESS_TOKEN=your-account-access-token --env REWORK_ACCOUNT_PASSWORD=your-account-password --env ENABLE_SSE=true --env PORT=8000
```

## Docker Deployment

```yaml
version: '3.8'

services:
  rework-mcp-server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:8000'
    environment:
      - REWORK_PROJECT_ACCESS_TOKEN=${REWORK_PROJECT_ACCESS_TOKEN}
      - REWORK_PROJECT_PASSWORD=${REWORK_PROJECT_PASSWORD}
      - REWORK_WORKFLOW_ACCESS_TOKEN=${REWORK_WORKFLOW_ACCESS_TOKEN}
      - REWORK_WORKFLOW_PASSWORD=${REWORK_WORKFLOW_PASSWORD}
      - REWORK_ACCOUNT_ACCESS_TOKEN=${REWORK_ACCOUNT_ACCESS_TOKEN}
      - REWORK_ACCOUNT_PASSWORD=${REWORK_ACCOUNT_PASSWORD}
      - ENABLE_SSE=true
      - LOG_LEVEL=info
    volumes:
      - ./src:/app/src
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```
## Features

| 📝 **Project Management**                                                                                           | 🔄 **Workflow Management**                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| • Create and manage tasks<br>• View task details<br>• List tasks in projects<br>• Add comments to tasks<br>• Organize tasks within projects<br>• View task status and progress | • Create and manage jobs<br>• Track job status<br>• View job details<br>• List jobs by workflow<br>• Organize workflows<br>• Link jobs to workflows |

| 👥 **User Management**                                                                                               | ⚡ **Integration Features**                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| • Find users by name or email<br>• List all available users<br>• Assign users to tasks<br>• View user information<br>• User authentication<br>• Manage user permissions | • ID and name-based lookups<br>• Markdown content support<br>• Built-in error handling<br>• API rate limiting<br>• Validation of inputs<br>• Comprehensive API coverage |

## Available Tools

| Tool | Description | Required Parameters |
| ---- | ----------- | ------------------- |
| **Project Management** |
| `create_task` | Create a task in a project | `name`, `board_id`, `creator_username` |
| `get_tasks` | Get tasks from a board | `board_id` and optional filters |
| `get_detail_task` | Get detailed information about a task | `id` |
| `get_projects` | Get all projects and boards | Optional search query `q` |
| **Workflow Management** |
| `create_job` | Create a job in a workflow | `name`, `workflow_id`, `creator_username` |
| `get_jobs` | Get jobs from a workflow | `workflow_id` and optional filters |
| `get_detail_job` | Get detailed information about a job | `id` |
| `get_workflows` | Get all available workflows | Optional search query `q` |
| **User Management** |
| `find_users` | Find users by name or email | `q` (search query), `properties` |
| `list_all_users` | Get all workspace members | None |

See the project documentation for optional parameters and advanced usage.

## User Management

When creating tasks or jobs, you can assign users using the `user_id` parameter. Additionally, you need to specify the `creator_username` to indicate who created the task or job:

```json
{
  "name": "🚀 New Feature Implementation",
  "board_id": "board_123",
  "content": "Implement the new feature described in the spec",
  "creator_username": "jane.doe",
  "user_id": "user_456"
}
```

The user management tools help you find users by name or email and get their IDs for task assignment.

## Error Handling

The Rework MCP server provides clear error messages for:

- Missing required parameters
- Invalid IDs or references
- Resources not found
- Authentication failures
- Permission issues
- API errors
- Rate limiting

The `LOG_LEVEL` environment variable can be specified to control the verbosity of server logs. Valid values are `trace`, `debug`, `info`, `warn`, and `error` (default).
This can also be specified on the command line as: `--env LOG_LEVEL=info`.

## Custom Fields Support

Both task and job creation support custom fields through the `custom_fields` parameter, which accepts an array of objects with `id` and `value` properties:

```json
{
  "custom_fields": [
    {
      "id": "custom_field_123",
      "value": "High Priority"
    },
    {
      "id": "custom_field_456",
      "value": true
    }
  ]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software makes use of the Rework API. All trademarks and brand names are the property of their respective owners. This project is not officially associated with or endorsed by Rework.
