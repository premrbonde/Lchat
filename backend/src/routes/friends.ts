import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { FriendRequest } from '../models/FriendRequest';
import mongoose from 'mongoose';

const router = Router();

// POST /api/friends/request
// Send a friend request to another user
router.post('/request', protect, async (req: AuthRequest, res) => {
  const { recipientId } = req.body;
  const requesterId = new mongoose.Types.ObjectId(req.user!.userId);

  if (!recipientId) {
    return res.status(400).json({ message: 'Recipient ID is required.' });
  }

  const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

  if (requesterId.equals(recipientObjectId)) {
    return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
  }

  try {
    // Check if they are already friends
    const requester = await User.findById(requesterId);
    if (requester?.friends.includes(recipientObjectId)) {
      return res.status(400).json({ message: 'You are already friends with this user.' });
    }

    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: requesterId, to: recipientObjectId },
        { from: recipientObjectId, to: requesterId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A friend request already exists between you and this user.' });
    }

    const newRequest = new FriendRequest({
      from: requesterId,
      to: recipientObjectId,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully.', request: newRequest });

  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Server error while sending friend request.' });
  }
});

// POST /api/friends/response
// Respond to a friend request (accept or reject)
router.post('/response', protect, async (req: AuthRequest, res) => {
  const { requestId, response } = req.body; // response: 'accept' or 'reject'
  const currentUserId = new mongoose.Types.ObjectId(req.user!.userId);

  if (!requestId || !response) {
    return res.status(400).json({ message: 'Request ID and response are required.' });
  }

  if (!['accept', 'reject'].includes(response)) {
    return res.status(400).json({ message: 'Invalid response. Must be "accept" or "reject".' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await FriendRequest.findById(requestId).session(session);

    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    if (!request.to.equals(currentUserId)) {
      await session.abortTransaction();
      return res.status(401).json({ message: 'You are not authorized to respond to this request.' });
    }

    if (request.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({ message: `This request has already been ${request.status}.` });
    }

    if (response === 'accept') {
      request.status = 'accepted';

      // Add each user to the other's friends list
      await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } }).session(session);
      await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } }).session(session);

      // Once accepted, we can delete the request document
      await request.deleteOne({ session });

      await session.commitTransaction();
      res.status(200).json({ message: 'Friend request accepted.' });

    } else { // 'reject'
      request.status = 'rejected';

      // Once rejected, we can delete the request document
      await request.deleteOne({ session });

      await session.commitTransaction();
      res.status(200).json({ message: 'Friend request rejected.' });
    }

  } catch (error) {
    await session.abortTransaction();
    console.error('Error responding to friend request:', error);
    res.status(500).json({ message: 'Server error while responding to friend request.' });
  } finally {
    session.endSession();
  }
});

export default router;
