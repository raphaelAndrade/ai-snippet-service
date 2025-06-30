import express from 'express';
import snippetRoutes from './routes/snippet.routes';
import authRoutes from './routes/auth.route';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(authRoutes);
app.use(snippetRoutes);

export default app;
