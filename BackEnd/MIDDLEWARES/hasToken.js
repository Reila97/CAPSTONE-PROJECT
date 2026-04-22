// Questo middleware è il "casello autostradale" della tua applicazione. Il suo compito è verificare che chiunque provi ad accedere a una rotta protetta abbia un "pass" (il Token) valido e non contraffatto.
import User from '../MODELS/User.js';
import jwt from 'jsonwebtoken'; 



export const hasToken = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]; // Prende il token dall'header Bearer

    if (!token) {
        return res.status(401).json({ message: "Non autenticato, token mancante" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id).select('-password');
            //verifico che ci sia
            if (!user) return res.status(401).json({ message: 'Utente non trovato' });
        
            req.user = user
        next();
    } catch (error) {
        res.status(401).json({ message: "Token non valido" });
    }
};