import { Schema, model, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  lastMessage?: Schema.Types.ObjectId;
}

const conversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, {
  timestamps: true
});

export const Conversation = model<IConversation>('Conversation', conversationSchema);
