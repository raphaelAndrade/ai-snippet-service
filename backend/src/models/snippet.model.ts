import mongoose, { Document, Schema } from 'mongoose';

export interface SnippetDocument extends Document {
  text: string;
  summary: string;
  userId: string;
}

const SnippetSchema = new Schema<SnippetDocument>(
  {
    text: { type: String, required: true },
    summary: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Snippet = mongoose.model<SnippetDocument>('Snippet', SnippetSchema);
