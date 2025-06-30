import { Router } from 'express';
import { createSnippet, getSnippets } from '../controllers/snippet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authMiddleware, createSnippet);
router.get('/snippets', authMiddleware, getSnippets);

export default router;
