import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

let token: string;

beforeAll(async () => {
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'user1@example.com', code: '123456' });

  token = loginResponse.body.token;
  expect(token).toBeDefined();
});

describe('Snippet API', () => {
  let snippetId: string;

  it('should return 401 if no auth header on GET /snippets', async () => {
    const res = await request(app).get('/snippets');
    expect(res.status).toBe(401);
  });

  it('should return 401 if no auth header on POST /snippets', async () => {
    const res = await request(app)
      .post('/snippets')
      .send({ text: 'Unauthorized snippet creation' });

    expect(res.status).toBe(401);
  });

  it('should create a snippet and return summary', async () => {
    const res = await request(app)
      .post('/snippets')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'This is a long text to be summarized.' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('summary');
    expect(res.body.text).toBeDefined();

    snippetId = res.body.id;
  }, 20000);

  it('should list user-specific snippets', async () => {
    const res = await request(app)
      .get('/snippets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('summary');
  });

  it('should fetch snippet by ID', async () => {
    const res = await request(app)
      .get(`/snippets/${snippetId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', snippetId);
    expect(res.body).toHaveProperty('summary');
  });

  it('should return 403 when accessing another user\'s snippet', async () => {
    const otherTokenRes = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', code: '123456' });

    const otherToken = otherTokenRes.body.token;

    const res = await request(app)
      .get(`/snippets/${snippetId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it('should stream summary (basic connection)', async () => {
    const res = await request(app)
      .get('/snippets/stream?text=Test streaming')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
  }, 10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
