import mongoose, { Document, Schema } from 'mongoose';

interface SnippetDocument extends Document {
  text: string;
  summary: string;
  ownerEmail: string;
}

const snippetSchema = new Schema<SnippetDocument>(
  {
    text: { type: String, required: true },
    summary: { type: String, required: true },
    ownerEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Snippet = mongoose.model<SnippetDocument>('Snippet', snippetSchema);

export default Snippet;
