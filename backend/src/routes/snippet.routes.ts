import { Router } from 'express';
import { createSnippet, getSnippets, streamSnippetSummary } from '../controllers/snippet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authMiddleware, createSnippet);
router.get('/snippets', authMiddleware, getSnippets);
router.post('/stream', authMiddleware, streamSnippetSummary);

export default router;
