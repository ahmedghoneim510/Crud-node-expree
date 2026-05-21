require('dotenv').config();

const http = require('http');
const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const startServer = async () => {
  await connectDB();

  // Create HTTP server (required for Socket.IO)
  const server = http.createServer(app);

  // Initialize Socket.IO on the HTTP server
  const io = initSocket(server);

  // Make io accessible in Express routes via req.app
  app.set('io', io);

  server.listen(config.port, () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`🔌 Socket.IO ready for connections`);
  });
};

startServer();
