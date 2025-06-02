# v0.7.2 Release Notes (2025-04-25)

## 🛠️ Bug Fixes

- Fixed time estimate support in task updates:
  - Removed redundant field-specific validation check in task update operations
  - Simplified validation to check only for the presence of update fields
  - Fixed "At least one field to update must be provided" error when using time_estimate
  - Added time string parsing for converting formats like "2h 30m" to minutes
  - Improved tool description for clear guidance on supported formats
  - Ensures compatibility with all fields defined in the UpdateTaskData type

## 📦 Dependencies

- No dependency changes in this release

## 🙏 Thank You

Special thanks to our contributors who reported and helped fix this issue:

- [@m-roberts](https://github.com/m-roberts) - Reporting and suggesting fix for the time estimate update issue

Your feedback helps make ClickUp MCP Server better for everyone!
