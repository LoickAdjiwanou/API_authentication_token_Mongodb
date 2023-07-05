import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res.status(400).json({ error: "Veuillez choisir un autre nom d'utilisateur" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ username: user.username }, 'mongoToken');

    res.header('x-auth-token', token);
    res.json({ message: `Utilisateur ${username} créé !` });
  } catch (err: any) {
    console.error("Failed to create user:", err);
    res.status(500).json({ error: `Failed to create user ==> ${(<Error>err).message}` });
  }
});

export default router;
