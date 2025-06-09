import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import configuration from './config.js';

const server = new McpServer({
  name: 'rework-mcp-server',
  version: '1.1.0',
});

const app = express();
app.use(express.json());



export function startSSEServer() {
  const transports = {
    streamable: {} as Record<string, StreamableHTTPServerTransport>,
    sse: {} as Record<string, SSEServerTransport>,
  };

  app.get('/sse', async (req, res) => {
    const transport = new SSEServerTransport('/messages', res);
    transports.sse[transport.sessionId] = transport;

    console.log(
      `New SSE connection established with sessionId: ${transport.sessionId}`
    );

    res.on('close', () => {
      delete transports.sse[transport.sessionId];
    });

    await server.connect(transport);
  });

  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.sse[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).send('No transport found for sessionId');
    }
  });

  const PORT = Number(configuration.port ?? '3231');
  app.listen(PORT, () => {
    console.log(`Connect to sse with http://localhost:${PORT}/sse`);
  });
}
