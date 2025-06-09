/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * Configuration handling for ClickUp API credentials and application settings
 *
 * The required environment variables (CLICKUP_API_KEY and CLICKUP_TEAM_ID) are passed
 * securely to this file when running the hosted server at smithery.ai. Optionally,
 * they can be parsed via command line arguments when running the server locally.
 *
 * The document support is optional and can be passed via command line arguments.
 * The default value is 'false' (string), which means document support will be disabled if
 * no parameter is passed. Pass it as 'true' (string) to enable it.
 */

// Parse any command line environment arguments
const args = process.argv.slice(2);
const envArgs: { [key: string]: string } = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--env' && i + 1 < args.length) {
    const [key, value] = args[i + 1].split('=');
    if (key === 'REWORK_PROJECT_ACCESS_TOKEN') envArgs.reworkProjectAccessToken = value;
    if (key === 'REWORK_PROJECT_PASSWORD') envArgs.reworkProjectPassword = value;
    if (key === 'REWORK_ACCOUNT_ACCESS_TOKEN') envArgs.reworkAccountAccessToken = value;
    if (key === 'REWORK_ACCOUNT_PASSWORD') envArgs.reworkAccountPassword = value;
    if (key === 'REWORK_WORKFLOW_ACCESS_TOKEN') envArgs.reworkWorkflowAccessToken = value;
    if (key === 'REWORK_WORKFLOW_PASSWORD') envArgs.reworkWorkflowPassword = value;
    if (key === 'DOCUMENT_SUPPORT') envArgs.documentSupport = value;
    if (key === 'DOCUMENT_MODEL') envArgs.documentSupport = value; // Backward compatibility
    if (key === 'DOCUMENT_MODULE') envArgs.documentSupport = value; // Backward compatibility
    if (key === 'LOG_LEVEL') envArgs.logLevel = value;
    if (key === 'DISABLED_TOOLS') envArgs.disabledTools = value;
    if (key === 'DISABLED_COMMANDS') envArgs.disabledTools = value; // Backward compatibility
    if (key === 'ENABLE_SSE') envArgs.enableSSE = value;
    if (key === 'PORT') envArgs.port = value;
    i++;
  }
}

// Log levels enum
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

// Parse LOG_LEVEL string to LogLevel enum
export const parseLogLevel = (levelStr: string | undefined): LogLevel => {
  if (!levelStr) return LogLevel.ERROR; // Default to ERROR if not specified

  switch (levelStr.toUpperCase()) {
    case 'TRACE':
      return LogLevel.TRACE;
    case 'DEBUG':
      return LogLevel.DEBUG;
    case 'INFO':
      return LogLevel.INFO;
    case 'WARN':
      return LogLevel.WARN;
    case 'ERROR':
      return LogLevel.ERROR;
    default:
      // Don't use console.error as it interferes with JSON-RPC communication
      return LogLevel.ERROR;
  }
};

// Define required configuration interface
interface Config {
  reworkProjectAccessToken: string;
  reworkProjectPassword: string;

  reworkAccountAccessToken: string;
  reworkAccountPassword: string;

  reworkWorkflowAccessToken: string;
  reworkWorkflowPassword: string;

  enableSponsorMessage: boolean;
  documentSupport: string;
  logLevel: LogLevel;
  disabledTools: string[];
  enableSSE: boolean;
  port?: string;
}

console.log(process.env)

// Load configuration from command line args or environment variables
const configuration: Config = {
  reworkProjectAccessToken: envArgs.reworkProjectAccessToken || process.env.REWORK_PROJECT_ACCESS_TOKEN || '',
  reworkProjectPassword: envArgs.reworkProjectPassword || process.env.REWORK_PROJECT_PASSWORD || '',

  reworkAccountAccessToken: envArgs.reworkAccountAccessToken || process.env.REWORK_ACCOUNT_ACCESS_TOKEN || '',
  reworkAccountPassword: envArgs.reworkAccountPassword || process.env.REWORK_ACCOUNT_PASSWORD || '',

  reworkWorkflowAccessToken: envArgs.reworkWorkflowAccessToken || process.env.REWORK_WORKFLOW_ACCESS_TOKEN || '',
  reworkWorkflowPassword: envArgs.reworkWorkflowPassword || process.env.REWORK_WORKFLOW_PASSWORD || '',

  enableSponsorMessage: process.env.ENABLE_SPONSOR_MESSAGE !== 'false',
  documentSupport:
    envArgs.documentSupport ||
    process.env.DOCUMENT_SUPPORT ||
    process.env.DOCUMENT_MODULE ||
    process.env.DOCUMENT_MODEL ||
    'false',
  logLevel: parseLogLevel(envArgs.logLevel || process.env.LOG_LEVEL),
  disabledTools:
    (envArgs.disabledTools || process.env.DISABLED_TOOLS || process.env.DISABLED_COMMANDS)
      ?.split(',')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd !== '') || [],
  enableSSE: envArgs.enableSSE === 'true' || process.env.ENABLE_SSE === 'true' || false,
  port: envArgs.port || process.env.PORT || '3231',
};

// Don't log to console as it interferes with JSON-RPC communication

// Validate only the required variables are present
const requiredVars = ['reworkProjectAccessToken', 'reworkProjectPassword', 'reworkAccountAccessToken', 'reworkAccountPassword', 'reworkWorkflowAccessToken', 'reworkWorkflowPassword'];
const missingEnvVars = requiredVars
  .filter(key => !configuration[key as keyof Config])
  .map(key => key);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default configuration;
