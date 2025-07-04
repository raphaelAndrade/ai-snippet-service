import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Snippet from '../models/snippet.model';
import { summarizeText, streamSummary } from '../services/gemini.service'

export const streamSnippetSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const text = req.query.text as string;
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

export const getSnippet = async (req: AuthRequest, res: Response,): Promise<void> => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    if (snippet.ownerEmail !== req.user?.email) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    res.json({
      id: snippet._id,
      text: snippet.text,
      summary: snippet.summary,
    });
  } catch (error) {
    console.error('get snippet Error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

export const listSnippets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user?.role === 'admin'
        ? {}
        : { ownerEmail: req.user?.email };
    const snippets = await Snippet.find(filter);
    res.json(
      snippets.map((s) => ({
        id: s._id,
        text: s.text,
        summary: s.summary,
      }))
    );
  } catch (error) {
    console.error('Error list snippet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
