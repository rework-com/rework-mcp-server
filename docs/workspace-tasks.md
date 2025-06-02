# get_workspace_tasks

The `get_workspace_tasks` tool provides a powerful way to retrieve tasks across the entire workspace with flexible filtering options, including tag-based filtering. This tool is especially useful for cross-list task organization and reporting.

## Key Features

- **Workspace-Wide Access**: Unlike `get_tasks` which only searches in one list, this tool searches across all spaces, folders, and lists.
- **Tag-Based Filtering**: Find tasks with specific tags anywhere in the workspace.
- **Multiple Filtering Dimensions**: Filter by lists, folders, spaces, statuses, assignees, and more.
- **Date Filtering**: Search by creation date, update date, or due date ranges.
- **Pagination Support**: Handle large result sets efficiently.

## Usage Examples

### Basic Usage

Retrieve all tasks from the workspace:

```
get_workspace_tasks
```

### Tag Filtering

Find all tasks with the "bug" tag:

```
get_workspace_tasks tags=["bug"]
```

Find tasks that have both "bug" and "high-priority" tags:

```
get_workspace_tasks tags=["bug", "high-priority"]
```

### Combining Multiple Filters

Find high-priority bugs assigned to a specific user that are due this month:

```
get_workspace_tasks 
  tags=["bug", "high-priority"] 
  assignees=["12345"] 
  due_date_gt=1680300000000 
  due_date_lt=1682978400000
```

### Filtering by Space and List

Find all tasks in a specific space:

```
get_workspace_tasks space_ids=["space123"]
```

Find tasks in multiple lists:

```
get_workspace_tasks list_ids=["list123", "list456"]
```

### Status and Archive Filtering

Find only open tasks:

```
get_workspace_tasks include_closed=false
```

Include archived tasks:

```
get_workspace_tasks archived=true
```

### Pagination

Get the first page of tasks, sorted by creation date:

```
get_workspace_tasks page=0 order_by="created" reverse=true
```

Get the second page:

```
get_workspace_tasks page=1 order_by="created" reverse=true
```

## Performance Considerations

For large workspaces, it's recommended to:

1. Use specific filters to narrow down results
2. Use pagination to handle large result sets
3. Consider filtering by space or list when possible
4. Be mindful of rate limiting implications

## Related Tools

- `get_tasks`: Retrieves tasks from a specific list
- `get_task`: Gets a single task's details
- `get_space_tags`: Retrieves available tags in a space that can be used for filtering 