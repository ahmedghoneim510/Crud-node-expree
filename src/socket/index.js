const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');

let io;

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - The HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // In production, restrict this to your frontend domain
      methods: ['GET', 'POST'],
    },
  });

  // ─── Authentication Middleware ───────────────────────────────────────
  // Verifies JWT token before allowing socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      // Allow unauthenticated connections with limited access
      socket.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (err) {
      // Still allow connection but mark as unauthenticated
      socket.user = null;
      next();
    }
  });

  // ─── Connection Handler ──────────────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id} | User: ${socket.user?.id || 'anonymous'}`);

    // Join user to their personal room (for targeted notifications)
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);

      // Admins join the admin room
      if (socket.user.role === 'admin') {
        socket.join('admins');
      }
    }

    // ─── Join Category Room ──────────────────────────────────────────
    // Clients can subscribe to product updates for specific categories
    socket.on('subscribe:category', (categoryId) => {
      socket.join(`category:${categoryId}`);
      console.log(`📂 ${socket.id} subscribed to category: ${categoryId}`);
    });

    socket.on('unsubscribe:category', (categoryId) => {
      socket.leave(`category:${categoryId}`);
      console.log(`📂 ${socket.id} unsubscribed from category: ${categoryId}`);
    });

    // ─── Real-time Chat (Support System) ─────────────────────────────
    socket.on('chat:join', (roomId) => {
      socket.join(`chat:${roomId}`);
      socket.to(`chat:${roomId}`).emit('chat:user-joined', {
        userId: socket.user?.id || 'anonymous',
        name: socket.user?.name || 'Guest',
        timestamp: new Date().toISOString(),
      });
      console.log(`💬 ${socket.id} joined chat room: ${roomId}`);
    });

    socket.on('chat:message', (data) => {
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: {
          id: socket.user?.id || 'anonymous',
          name: socket.user?.name || 'Guest',
        },
        text: data.text,
        roomId: data.roomId,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to everyone in the room (including sender)
      io.to(`chat:${data.roomId}`).emit('chat:message', message);
      console.log(`💬 Message in room ${data.roomId}: ${data.text}`);
    });

    socket.on('chat:typing', (data) => {
      socket.to(`chat:${data.roomId}`).emit('chat:typing', {
        userId: socket.user?.id || 'anonymous',
        name: socket.user?.name || 'Guest',
        isTyping: data.isTyping,
      });
    });

    socket.on('chat:leave', (roomId) => {
      socket.leave(`chat:${roomId}`);
      socket.to(`chat:${roomId}`).emit('chat:user-left', {
        userId: socket.user?.id || 'anonymous',
        name: socket.user?.name || 'Guest',
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Disconnect ──────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  return io;
};

/**
 * Get the Socket.IO instance (use after initialization)
 * @returns {Server}
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initSocket first.');
  }
  return io;
};

module.exports = { initSocket, getIO };
