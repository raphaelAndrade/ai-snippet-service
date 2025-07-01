import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Snippet from '../models/snippet.model';
import { summarizeText, streamSummary } from '../services/gemini.service'

export const streamSnippetSummary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const text = req.body.text as string;
      if (!text) {
        res.status(400).json({ error: 'Missing text param' });
        return;
      }
  
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
  
      for await (const chunk of streamSummary(text)) {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
  
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error('SSE error', error);
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
      res.end();
    }
  };

export const createSnippet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
  
      const summary = await summarizeText(text);
  
      const snippet = await Snippet.create({
        text,
        summary,
        ownerEmail: req.user?.email,
      });
  
      res.status(201).json({
        id: snippet._id,
        text,
        summary
      });
    } catch (error) {
        console.error('Error creating snippet:', error);
        res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : error });
      }
  };

export async function getSnippets(req: AuthRequest, res: Response): Promise<void> {
try {
    const snippets = await Snippet.find({ ownerEmail: req.user?.email });
    res.status(200).json(snippets);
} catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({ error: 'Failed to fetch snippets' });
}
}
  