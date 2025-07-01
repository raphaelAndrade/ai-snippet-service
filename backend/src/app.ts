import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import snippetRoutes from './routes/snippet.routes';
import authRoutes from './routes/auth.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/snippets', snippetRoutes);

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: 'ai_snippets' })
    .then(() => console.log('Mongo connected'))
    .catch((err) => console.error('Mongo connection error:', err));
}

export default app;
