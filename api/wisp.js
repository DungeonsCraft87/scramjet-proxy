import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const server = createServer();

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

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

// Vercel requires an http.Server export to handle raw WebSocket upgrades
export default server;
