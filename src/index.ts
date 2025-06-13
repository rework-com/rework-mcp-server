#!/usr/bin/env node

/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * Rework MCP Server
 *
 * This custom server implements the Model Context Protocol (MCP) specification to enable
 * AI applications to interact with Rework workspaces. It provides a standardized
 * interface for managing tasks, lists, folders and other Rework entities using Natural Language.
 *
 * Key Features:
 * - Complete task management (CRUD operations, moving, duplicating)
 * - Workspace organization (spaces, folders, lists)
 * - Bulk operations with concurrent processing
 * - Natural language date parsing
 * - File attachments support
 * - Name-based entity resolution
 * - Markdown formatting
 * - Built-in rate limiting
 *
 * For full documentation and usage examples, please refer to the README.md file.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { startStdioServer } from './server.js'
import { info, error } from './logger.js';
import config from './config.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { startSSEServer } from './sse_server.js';

// Get directory name for module paths
const __dirname = dirname(fileURLToPath(import.meta.url));

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  error('Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  error('Unhandled Rejection', { reason });
  process.exit(1);
});


/**
 * Application entry point that configures and starts the MCP server.
 */
async function main() {
  try {
    if (config.enableSSE) {
      startSSEServer();
    } else {
      await startStdioServer();
    }
  } catch (err) {
    error('Error during server startup', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

main().catch(err => {
  error('Unhandled server error', { message: err.message, stack: err.stack });
  process.exit(1);
});
