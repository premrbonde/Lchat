import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { FriendRequest } from '../models/FriendRequest';
import mongoose from 'mongoose';

const router = Router();

// GET /api/users/search?query=...
// Searches for users by username or nickname, excluding self, current friends,
// and users with whom a friend request is already pending.
router.get('/search', protect, async (req: AuthRequest, res) => {
  const query = req.query.query as string;
  const currentUserId = new mongoose.Types.ObjectId(req.user!.userId);

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // 1. Find the current user to get their list of friends
    const currentUser = await User.findById(currentUserId).select('friends').lean();
    const friendIds = currentUser ? currentUser.friends : [];

    // 2. Find all pending friend requests involving the current user
    const pendingRequests = await FriendRequest.find({
      $or: [{ from: currentUserId }, { to: currentUserId }],
      status: 'pending'
    }).lean();

    // 3. Create a list of user IDs to exclude from the search
    const userIdsToExclude = pendingRequests.reduce((acc, req) => {
      // If the request was sent from me, exclude the person I sent it to.
      if (req.from.equals(currentUserId)) {
        acc.push(req.to);
      }
      // If the request was sent to me, exclude the person who sent it.
      else {
        acc.push(req.from);
      }
      return acc;
    }, [currentUserId, ...friendIds]); // Start with self and friends

    // 4. Find users matching the query, excluding the identified users
    const users = await User.find({
      _id: { $nin: userIdsToExclude },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { nickname: { $regex: query, $options: 'i' } }
      ]
    }).limit(15); // Add a limit to avoid sending too much data

    res.status(200).json(users);

  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error while searching for users.' });
  }
});

export default router;
