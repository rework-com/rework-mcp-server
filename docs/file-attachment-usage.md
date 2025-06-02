# ClickUp Task File Attachments

This document provides examples and explanations for using the file attachment feature of the ClickUp MCP server.

## Overview

The server provides a single unified tool for attaching files to ClickUp tasks, with intelligent method selection based on the file source and size.

## Available Methods

The attachment tool supports three different methods internally:

1. **Base64 Method**: For small files encoded as base64 strings (automatically used when providing `file_data`)
2. **URL Method**: For files available online (automatically used when providing `file_url`)
3. **Chunked Upload**: For large files (automatically used when base64 file size exceeds limits)

## Basic Usage

### Method 1: Upload from Base64 Data

Use this method for small files by providing the file content as a base64-encoded string.

```javascript
// Node.js example
const fs = require('fs');
const path = require('path');

// Read a file and convert to base64
const filePath = path.join(__dirname, 'example.pdf');
const fileData = fs.readFileSync(filePath);
const fileBase64 = fileData.toString('base64');

// Call the MCP tool
const result = await mcpClient.callTool('attach_task_file', {
  taskId: 'abc123xyz', // ClickUp task ID
  file_name: 'example.pdf',
  file_data: fileBase64
});

console.log(result);
```

### Method 2: Upload from URL

Use this method when the file is already available at a URL (e.g., cloud storage, CDN).

```javascript
// Call the MCP tool
const result = await mcpClient.callTool('attach_task_file', {
  taskId: 'abc123xyz', // ClickUp task ID
  file_url: 'https://example.com/path/to/file.pdf',
  file_name: 'renamed-file.pdf', // Optional, will use URL filename if omitted
  auth_header: 'Bearer token123' // Optional, for accessing protected resources
});

console.log(result);
```

### Method 3: Large File Upload (Automatic Chunking)

For files larger than 10MB, the system automatically handles chunking for you. You just provide the file data as with small files.

```javascript
// Node.js example with large file
const fs = require('fs');
const path = require('path');

// Read a large file and convert to base64
const filePath = path.join(__dirname, 'large-file.zip');
const fileData = fs.readFileSync(filePath);
const fileBase64 = fileData.toString('base64');

// Call the MCP tool - chunking happens automatically
const result = await mcpClient.callTool('attach_task_file', {
  taskId: 'abc123xyz', // ClickUp task ID
  file_name: 'large-file.zip',
  file_data: fileBase64
});

// System will start chunked upload process if file is large
if (result.chunk_session) {
  console.log(`Large file detected, chunked upload started: ${result.progress}%`);
  // The operation will complete automatically
}

console.log(result);
```

## Parameters

### Common Parameters
- `taskId`: ID of the task to attach the file to
- `taskName` + `listName`: Alternative to taskId if you only know the task name
- `file_name`: Name of the file (with extension) - required when using file_data

### Method-Specific Parameters
- `file_data`: Base64-encoded file content for direct uploads
- `file_url`: URL to download the file from
- `auth_header`: Optional authorization header to use with file_url

### Advanced Parameters (rarely needed)
The tool also supports advanced parameters for manual chunk handling in special cases:
- `chunk_session`: Session identifier for chunked uploads
- `chunk_index`: Index of the current chunk
- `chunk_is_last`: Whether this is the final chunk

## Best Practices

1. **Choose the right method**:
   - For files you have locally: Use base64 encoding (file_data parameter)
   - For files already online: Use URL method (file_url parameter)

2. **Error handling**:
   - Implement proper error handling and retries
   - For large files, be prepared to handle chunked upload responses

3. **File size considerations**:
   - Base64 encoding increases size by ~33%
   - Very large files may cause memory issues in client applications
   - Consider streaming approaches for extremely large files

4. **Security considerations**:
   - Validate file types before uploading
   - Don't transmit sensitive files over insecure connections

## Troubleshooting

### Common Issues

1. **"File size exceeds limit"**
   - Check your ClickUp plan's file size limits
   - Very large files may exceed server limits

2. **"Invalid task ID"**
   - Verify the task exists and you have permission to access it

3. **"Unable to download from URL"**
   - Ensure the URL is publicly accessible
   - Check if auth_header is required

For additional assistance, please contact support or file an issue in the repository. 