import { Schema, model, Document } from 'mongoose';
import { FriendRequest } from './FriendRequest'; // Assuming FriendRequest model exists for pre-remove hook

export interface IUser extends Document {
  username: string;
  nickname: string;
  email: string;
  password?: string; // Optional because it will be removed in toJSON
  profilePicture?: string;
  friends: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true, index: true },
  nickname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  password: { type: String, required: true, select: false }, // Hide by default
  profilePicture: { type: String, default: 'default_avatar.png' },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password; // Do not send password hash to client
      return ret;
    }
  }
});

// Pre-remove hook to clean up friend requests when a user is deleted
userSchema.pre<IUser>('remove', async function(next) {
  // This is a placeholder, as the FriendRequest model doesn't exist yet.
  // I will uncomment this later.
  // await FriendRequest.deleteMany({ $or: [{ from: this._id }, { to: this._id }] });
  next();
});

export const User = model<IUser>('User', userSchema);
