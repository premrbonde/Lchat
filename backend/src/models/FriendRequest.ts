import { Schema, model, Document } from 'mongoose';

export interface IFriendRequest extends Document {
  from: Schema.Types.ObjectId;
  to: Schema.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
}

const friendRequestSchema = new Schema<IFriendRequest>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure a user cannot send more than one request to the same person
friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

export const FriendRequest = model<IFriendRequest>('FriendRequest', friendRequestSchema);
