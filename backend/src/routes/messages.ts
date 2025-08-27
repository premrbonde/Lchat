import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';
import mongoose from 'mongoose';

const router = Router();

// GET /api/messages?conversationId=...&page=1&limit=30
// Fetches paginated messages for a given conversation.
router.get('/', protect, async (req: AuthRequest, res) => {
  const { conversationId } = req.query;
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '30', 10);
  const currentUserId = new mongoose.Types.ObjectId(req.user!.userId);

  if (!conversationId) {
    return res.status(400).json({ message: 'Conversation ID is required.' });
  }

  try {
    // Step 1: Verify that the current user is part of the conversation.
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId
    });

    if (!conversation) {
      return res.status(403).json({ message: 'You are not authorized to view this conversation.' });
    }

    // Step 2: Fetch the paginated messages.
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) // Get the latest messages first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'username nickname profilePicture'); // Attach sender's public info

    // Also send total message count for pagination logic on the frontend
    const totalMessages = await Message.countDocuments({ conversationId });

    res.status(200).json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages.' });
  }
});

export default router;
