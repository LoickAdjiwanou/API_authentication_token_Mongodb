import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ error: "Veuillez choisir un autre nom d'utilisateur" });
        }
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign({ username: user.username }, 'mongoToken');
        console.log(token);
        // Ajout du token au header
        res.header('x-auth-token', token);
        // Renvoyer le token dans la réponse
        res.json({ message: `Utilisateur ${username} créé !`, token });
    }
    catch (err) {
        console.error("Failed to create user:", err);
        res.status(500).json({ error: `Failed to create user ==> ${err.message}` });
    }
});
export default router;
//# sourceMappingURL=signup.js.map