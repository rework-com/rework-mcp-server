# ClickUp Task Attachment Examples

This document provides examples of how to use the `attach_task_file` tool with different file sources.

## Important Note About Parameters

The `file_url` parameter is a dual-purpose parameter that can accept either:
1. An absolute local file path (starting with `/` on Unix/Mac or `C:\` on Windows)
2. A web URL (starting with `http://` or `https://`)

This design allows for a unified interface, but it's important to provide the correct format.

## 1. Using Local File Path (Recommended)

The simplest way to attach a file is by providing an absolute path to a local file using the `file_url` parameter:

```javascript
const response = await mcp.invoke("attach_task_file", {
  taskId: "86b4bnnny",
  file_url: "/absolute/path/to/your/document.pdf"  // Note: Uses file_url for local path
});

console.log(response);
// {
//   success: true,
//   message: "File \"document.pdf\" successfully attached to task 86b4bnnny",
//   attachment: { ... }
// }
```

⚠️ **Note:** Only absolute file paths are supported (starting with `/` on Unix/Mac or `C:\` on Windows).

You can also specify a custom file name:

```javascript
const response = await mcp.invoke("attach_task_file", {
  taskId: "86b4bnnny",
  file_url: "/absolute/path/to/your/document.pdf",  // Uses file_url for local path
  file_name: "Important-Document.pdf"
});
```

## 2. Using URL-Based Method

For files that are already available online, use the same `file_url` parameter with a web URL:

```javascript
const response = await mcp.invoke("attach_task_file", {
  taskId: "86b4bnnny",
  file_url: "https://example.com/path/to/document.pdf"  // Uses file_url for web URL
});
```

With authorization if needed:

```javascript
const response = await mcp.invoke("attach_task_file", {
  taskId: "86b4bnnny",
  file_url: "https://example.com/path/to/document.pdf",  // Uses file_url for web URL
  auth_header: "Bearer your-access-token"
});
```

## 3. Using Base64-Encoded Method

For programmatically generated files or when working with file data:

```javascript
const fs = require('fs');
const filePath = '/path/to/your/document.pdf';
const fileData = fs.readFileSync(filePath);
const base64Data = fileData.toString('base64');

const response = await mcp.invoke("attach_task_file", {
  taskId: "86b4bnnny",
  file_data: base64Data,
  file_name: "document.pdf"
});
```

## 4. Using Task Name Instead of ID

You can also reference tasks by name and list:

```javascript
const response = await mcp.invoke("attach_task_file", {
  taskName: "My Important Task",
  listName: "Development Tasks",
  file_url: "/absolute/path/to/your/document.pdf"
});
```

## Notes

- For large files (>10MB), the tool automatically switches to chunked uploading
- Local file paths must be absolute (starting with `/` on Unix/Mac or drive letter like `C:\` on Windows)
- The tool will extract the filename from the path if not explicitly provided 