import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import User from './models/User.js';

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      // Fetch user name from database
      try {
        const user = await User.findById(decoded.id).select('name').lean();
        socket.userName = user?.name || 'User';
      } catch {
        socket.userName = 'User';
      }
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userName} (${socket.userId})`);
    
    // Emit user info to client
    socket.emit('user-info', {
      userId: socket.userId,
      userName: socket.userName,
      userRole: socket.userRole
    });

    // Join a chat room (could be course-specific or general)
    socket.on('join-room', async (room) => {
      socket.join(room);
      socket.emit('joined-room', room);
      // Send recent messages
      try {
        const messages = await Message.find({ room })
          .populate('sender', 'name role')
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        socket.emit('recent-messages', messages.reverse());
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    });

    // Leave a room
    socket.on('leave-room', (room) => {
      socket.leave(room);
    });

    // Handle new message
    socket.on('send-message', async (data) => {
      try {
        const { room, message, receiver } = data;
        const newMessage = new Message({
          sender: socket.userId,
          receiver,
          room,
          message
        });
        await newMessage.save();
        
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'name role')
          .lean();

        // Broadcast to room or send to specific receiver
        if (room) {
          io.to(room).emit('receive-message', populatedMessage);
        } else if (receiver) {
          io.to(receiver).emit('receive-message', populatedMessage);
          socket.emit('receive-message', populatedMessage); // Also send to sender
        }
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', { msg: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userName}`);
    });
  });

  return io;
}

