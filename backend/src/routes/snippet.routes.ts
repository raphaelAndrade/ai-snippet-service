import { Router } from 'express';
import {
  createSnippet,
  getSnippet,
  listSnippets,
  streamSnippetSummary,
} from '../controllers/snippet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createSnippet);                 
router.get('/', authMiddleware, listSnippets);                    
router.get('/stream', authMiddleware, streamSnippetSummary);     
router.get('/:id', authMiddleware, getSnippet);               

export default router;
