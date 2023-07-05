import { Router } from 'express';
import User from '../models/user';
import { compare } from 'bcrypt';
const router = Router();
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Accès invalides" });
        }
        const result = await compare(password, user.password);
        if (!result) {
            res.status(401).json({ error: "Accès invalides" });
            return;
        }
        // Réponse de connexion réussie
        res.json({ message: "Connexion réussie !" });
    }
    catch (err) {
        console.error("Utilisateur introuvable:", err);
        res.status(500).json({ error: "Utilisateur introuvable" });
    }
});
export default router;
//# sourceMappingURL=login.js.map