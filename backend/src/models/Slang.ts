import { Schema, model, Document } from 'mongoose';

export interface ISlang extends Document {
  term: string;
  definition: string;
}

const slangSchema = new Schema<ISlang>({
  term: { type: String, required: true, unique: true, index: true, trim: true },
  definition: { type: String, required: true, trim: true }
});

export const Slang = model<ISlang>('Slang', slangSchema);
