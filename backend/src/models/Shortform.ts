import { Schema, model, Document } from 'mongoose';

export interface IShortform extends Document {
  term: string;
  expansion: string;
}

const shortformSchema = new Schema<IShortform>({
  term: { type: String, required: true, unique: true, index: true, trim: true },
  expansion: { type: String, required: true, trim: true }
});

export const Shortform = model<IShortform>('Shortform', shortformSchema);
