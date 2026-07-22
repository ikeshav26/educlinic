import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectRedis } from './src/config/redis.js';
import { setupChatSocket } from './src/socket/chat.socket.js';

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  },
});

setupChatSocket(io);

const startAllServices: () => Promise<void> = async () => {
  await Promise.all([connectRedis()]);
};

startAllServices().then(() => {
  httpServer.listen(env.PORT, () => {
    console.log(`Server and Socket.IO running on port ${env.PORT}`);
  });
});

