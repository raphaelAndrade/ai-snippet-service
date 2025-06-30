import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { mockUsers } from '../data/mock-users';

const router = Router();
// @ts-expect-error: imported type is incompatible with Express route typing
router.post('/login', (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = mockUsers.find((u) => u.email === email && u.code === code);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or code' });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default router;
