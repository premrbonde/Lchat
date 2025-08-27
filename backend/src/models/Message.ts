import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  text: string;
}

const messageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true }
}, {
  timestamps: true
});

export const Message = model<IMessage>('Message', messageSchema);
