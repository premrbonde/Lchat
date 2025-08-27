import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './src/db';
import authRoutes from './src/routes/auth';
import friendRoutes from './src/routes/friends';
import userRoutes from './src/routes/users';
import messageRoutes from './src/routes/messages';
import nlpRoutes from './src/routes/nlp';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend's URL
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/nlp', nlpRoutes);


// A simple root route to check if the server is up
app.get('/', (req, res) => {
  res.send('LChat API Server is running...');
});

import jwt from 'jsonwebtoken';
import { Message } from './src/models/Message';
import { Conversation } from './src/models/Conversation';

// Extend the Socket type for our use case
interface AuthenticatedSocket extends SocketIOServer {
    user?: { userId: string };
}

// Socket.IO Authentication Middleware
io.use((socket: any, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: No token provided.'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        socket.user = { userId: decoded.userId };
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token.'));
    }
});

io.on('connection', (socket: any) => {
    console.log(`Socket connected: ${socket.id}, User: ${socket.user.userId}`);

    socket.on('joinConversation', (conversationId: string) => {
        socket.join(conversationId);
        console.log(`User ${socket.user.userId} joined conversation ${conversationId}`);
    });

    socket.on('sendMessage', async ({ conversationId, text }: { conversationId: string, text: string }) => {
        if (!text || !conversationId) return;

        try {
            const newMessage = new Message({
                conversationId,
                sender: socket.user.userId,
                text,
            });
            await newMessage.save();

            const populatedMessage = await newMessage.populate('sender', 'username nickname profilePicture');

            await Conversation.findByIdAndUpdate(conversationId, { lastMessage: newMessage._id });

            io.to(conversationId).emit('newMessage', populatedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Failed to send message.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});
