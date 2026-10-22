import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Vercel requires an http.Server to manage the WebSocket upgrade lifecycle.
const server = http.createServer();

// Attach the WebSocket server directly to the HTTP server.
const wss = new WebSocketServer({ server });

wss.on('connection', (clientWs) => {
  // Your Cloudflare Worker URL
  const workerWs = new WebSocket("wss://aged-rice-8680.dungeonscraft88.workers.dev/");

  clientWs.on('message', (data) => {
    if (workerWs.readyState === WebSocket.OPEN) workerWs.send(data);
  });

  workerWs.on('message', (data) => {
    if (clientWs.readyState === WebSocket.OPEN) clientWs.send(data);
  });

  clientWs.on('close', () => workerWs.close());
  workerWs.on('close', () => clientWs.close());

  clientWs.on('error', () => workerWs.close());
  workerWs.on('error', () => clientWs.close());
});

// Export the server instance
export default server;
