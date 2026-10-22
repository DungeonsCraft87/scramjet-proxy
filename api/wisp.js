import { WebSocketServer } from 'ws';

export default function handler(req, res) {
  if (req.headers.upgrade?.toLowerCase() !== 'websocket') {
    return res.status(400).send('Expected WebSocket upgrade');
  }

  const wss = new WebSocketServer({ noServer: true });

  wss.handleUpgrade(req, req.socket, req.headers, (clientWs) => {
    const workerWs = new WebSocket("wss://aged-rice-8680.dungeonscraft88.workers.dev/");

    clientWs.on('message', (data) => {
      if (workerWs.readyState === WebSocket.OPEN) workerWs.send(data);
    });

    workerWs.on('message', (data) => {
      if (clientWs.readyState === WebSocket.OPEN) clientWs.send(data);
    });

    clientWs.on('close', () => workerWs.close());
    workerWs.on('close', () => clientWs.close());
  });
}

export const config = {
  api: { bodyParser: false },
};
