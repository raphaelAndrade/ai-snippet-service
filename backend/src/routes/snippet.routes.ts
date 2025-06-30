import { Router } from 'express';
import { createSnippet } from '../controllers/snippet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/', authMiddleware, createSnippet);

export default router;
