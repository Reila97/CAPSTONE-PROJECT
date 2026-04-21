import User from "../MODELS/User.js";
import jwt from "jsonwebtoken"

export async function login(req, res) {
    try {
        //ricezione dati dal frontend
        const { email, password } = req.body

        //validazione 
        if (!email || !password) {
            return res.status(400).json({ message: "Inserisci email e password" });
        }

        // Ricerca utente
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'credenziali errate' })
        }

        // Verifica password
        const pswCorrect = await user.comparePassword(password);
       if (!pswCorrect) {
            return res.status(401).json({ message: 'Credenziali errate' });
        }

        //Generazione Token (Sincrona, più leggibile)
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            message: "Login effettuato",
            token, // Ora il nome coincide
            user: {
                id: user._id,
                nome: user.nome,
                isAdmin: user.isAdmin
            }
        });


    } catch (error) {
       console.error(error);
        res.status(500).json({ message: "Errore interno del server" });
    }
}