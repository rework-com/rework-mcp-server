# Changelog

## [Unreleased]
- Added member management tools: `getWorkspaceMembers`, `findMemberByName`, and `resolveAssignees`.
- Task creation now supports the `assignees` parameter, allowing assignment of users at creation time.
- Improved error handling and response formatting for member and task handlers.
- Refactored imports and code organization for maintainability.

## v0.7.2 (2025-04-25)

### 🛠️ Bug Fixes

- Fixed time estimate support in task updates:
  - Removed redundant field-specific validation check in task update operations
  - Simplified validation to check only for the presence of update fields
  - Fixed "At least one field to update must be provided" error when using time_estimate
  - Added time string parsing for converting formats like "2h 30m" to minutes
  - Improved tool description for clear guidance on supported formats
  - Ensures compatibility with all fields defined in the UpdateTaskData type

### 🔗 References

- #45: [Bug: Time estimates not allowed when updating tasks](https://github.com/taazkareem/clickup-mcp-server/issues/45)

## v0.7.1 (2025-04-24)

### 🚀 New Features & Improvements

- Added Documents Module with comprehensive document management:
  - Document listing and search across workspace
  - Document creation with customizable visibility
  - Document page management (create, list, get, update)
  - Optional module activation via `DOCUMENT_SUPPORT=true` environment variable
  - Support for both API V2 and V3 endpoints
- Added comprehensive Time Tracking functionality:
  - View time entries for tasks with filtering options
  - Start/stop time tracking on tasks
  - Add manual time entries with flexible duration formats
  - Delete time entries
  - View currently running timer with elapsed time information
  - Track billable and non-billable time
- Added command disabling capability:
  - New `DISABLED_TOOLS` environment variable
  - Disable specific commands via comma-separated list
  - Support for both environment variable and command line argument
  - Improved security through selective command access
  - Clear error messages for disabled command attempts

### 🛠️ Bug Fixes & Improvements

- Fixed custom task ID lookup in `getTaskByCustomId` method:
  - Corrected API endpoint from `/task/custom_task_ids` to `/task/{id}` with proper parameters
  - Added required `custom_task_ids=true` and `team_id` parameters for proper authentication
  - Fixed "Authorization failed" error when retrieving tasks by custom ID
  - Improved error handling and logging for custom ID operations
- Fixed JSON schema type definitions in task tools for improved compatibility with third-party parsers:
  - Updated schema to use single string type with nullable property instead of array types
  - Ensures compatibility with Go-based parsers like windsurf that have strict type requirements
  - Affected tools: `update_task`, `update_bulk_tasks`
- Enhanced custom field handling in task updates:
  - Fixed issue with custom field updates not being properly applied
  - Improved validation and processing of custom field values
  - Ensures consistent behavior across all task update operations

### 🔄 Repository Updates

- Updated documentation with new document module features
- Added configuration guide for disabled commands
- Enhanced API reference with document management examples
- Added documentation for time tracking tools
- Improved API reference accuracy for task update operations

### 🔗 References

- #37: [Fix authorization issue with custom task IDs](https://github.com/taazkareem/clickup-mcp-server/issues/37)
- #36: [Fix types for windsurf compatibility](https://github.com/taazkareem/clickup-mcp-server/pull/36)
- #38: [Add time tracking functionality](https://github.com/taazkareem/clickup-mcp-server/pull/38)
- #39: [Add command disabling capability](https://github.com/taazkareem/clickup-mcp-server/pull/39)
- #40: [Fix custom field updates](https://github.com/taazkareem/clickup-mcp-server/pull/40)
- #41: [Add document module](https://github.com/taazkareem/clickup-mcp-server/pull/41)

## v0.6.9 (2025-04-03)

### 🚀 New Features & Improvements

- Enhanced token limit protection for workspace tasks:
  - Added handler-level token limit validation (50,000 tokens)
  - Implemented smart response format switching
  - Automatic fallback to summary format for large responses
  - Improved token estimation for task responses
  - Added logging for format switching events
  - Double-layer protection at both service and handler levels

### 🔄 Repository Updates

- Updated task handler implementation with token limit checks
- Added token estimation utilities for task responses

## v0.6.6 (2025-04-03)

### 🐛 Bug Fixes

- Fixed task caching issue causing rate limits:
  - Task IDs from name lookups weren't being shared between sequential operations
  - Each tool operation was performing redundant global task searches
  - Added task name-to-ID mapping in cache to prevent duplicate lookups
  - Improved caching efficiency for sequential operations on same task

## v0.6.5 (2025-03-28)

- Added start date support for tasks:
  - Set task start dates with natural language expressions (e.g., "now", "tomorrow at 9am")
  - Support for both creation and updates via `startDate` parameter
  - Proper time handling with `start_date_time` flag
- Added Global Task Lookup feature:
  - Find tasks by name across the entire workspace without specifying a list
  - Smart disambiguation when multiple tasks share the same name
  - Context-aware results showing list, folder, and space for each match
  - Default selection of most recently updated task when multiple matches exist
  - Backward compatible with list-specific lookups
  - Applied to all task operations: get_task, update_task, delete_task, etc.
  - Improved error messages with actionable information for disambiguation

### 🚀 Performance Optimizations

- Implemented parallel request optimization for task operations:
  - Parallel validation of tasks and lists in move operations
  - Concurrent processing of task and list data
- Added task validation caching:
  - 5-minute TTL cache for task and list validations
  - Reduced redundant API calls in bulk operations
  - Optimized cache updates after successful operations
- Enhanced workspace hierarchy fetching:
  - Implemented batched space processing (3 spaces at a time)
  - Added batched folder processing (5 folders at a time)
  - Improved rate limit compliance with controlled concurrency
  - Added detailed performance logging and metrics

## v0.6.2 (2025-03-27)

### 🛠️ Bug Fixes

- Fixed binary execution issue by adding proper shebang line to the main executable

### 🚀 New Features & Improvements

- Added tag support with tools for:
  - Managing tags at the space level (get, create, update, delete)
  - Adding/removing tags from tasks
  - Support for tags when creating and updating tasks
- Enhanced bulk task creation with tags support
- Added natural language color processing for tags:
  - Create tags with color names (e.g., "blue", "red", "yellow")
  - Support for color variations (e.g., "dark blue", "light green")
  - Automatic generation of contrasting foreground colors
  - Color commands in both tag creation and updates
- Added `get_workspace_tasks` tool for retrieving filtered workspace tasks by various criteria:
  - Requires at least one filter parameter (tags, list_ids, space_ids, etc.)
  - Supports filtering by tags, due dates, status, and more
  - Includes pagination and sorting options
  - Implements Adaptive Response Format with two detail levels:
    - `summary`: Lightweight response with essential task information
    - `detailed`: Complete task information with all fields (default)
  - Automatic format selection based on response size (50,000 token threshold)
  - Optimized for handling large datasets efficiently

### 🔄 Repository Updates

- Updated documentation to reflect new tool requirements and capabilities
- Improved API reference with detailed examples and response formats

## v0.6.0 (2025-03-26)

### 🚀 New Features & Improvements

- Added subtasks support with multi-level nesting capability
- Implemented parent parameter for creating subtasks
- Made logging level configurable via environment variable or command line
- Fixed custom task ID handling across all operations
- Default log level now set to ERROR for improved compatibility

### 📦 Dependencies

- No dependency changes in this release

### 🔄 Repository Updates

- Updated documentation for subtasks feature
- Improved API reference with subtasks examples
- Added Security Policy and Code of Conduct

### 🔗 References

- #18: [See pull request](https://github.com/taazkareem/clickup-mcp-server/pull/18)
- #20: [See pull request](https://github.com/taazkareem/clickup-mcp-server/pull/20)

## v0.5.1 (2025-03-23)

### 🚀 New Features & Improvements

- Added support for Custom IDs across all tools
- New tools:
  - `attach_task_file`: Attach files to tasks using local paths, URLs, or base64 data
  - `create_task_comment`: Add comments to tasks
  - `get_task_comments`: Retrieve comments from tasks
- Enhanced date parsing with support for "X minutes from now" expressions
- Improved task name matching with greater flexibility:
  - Case-insensitive matching
  - Partial name matching
  - Matching without emojis
- Fixed error response formatting in task comment retrieval
- Improved workspace hierarchy display to correctly show lists directly in spaces

### 📦 Dependencies

- Updated dependencies to use semantic versioning
- Upgraded:
  - @modelcontextprotocol/sdk: 0.6.0 → 0.6.1
  - axios: 1.6.7 → 1.8.4
  - dotenv: 16.4.1 → 16.4.7

### 🔄 Repository Updates

- Added automated changelog generation
- Updated documentation and README
- Added funding options through GitHub Sponsors and Buy Me A Coffee

## v0.5.0 (2025-03-22)

### 🚀 Initial Release

- First public version of ClickUp MCP Server
- Core functionality for task, list, and folder management
- Basic workspace hierarchy navigation
- NPM and Smithery deployment options

### 🔄 Repository Updates

- Initial README and documentation
- Added GitHub workflow for publishing
- Created Funding options through GitHub Sponsors and Buy Me a Coffee

### 🔗 References

- #12: [See pull request](https://github.com/taazkareem/clickup-mcp-server/pull/12)
