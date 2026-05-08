import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken';

import { login } from "../CONTROLLERS/login.js"
import { register } from '../CONTROLLERS/register.js'
import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js';


const loginRouter = express.Router()

loginRouter.post('/upload-temp', cloudinaryUploadImg.single('avatar'), (req, res) => {
    try {
        // req.file.path contiene l'URL di Cloudinary grazie al middleware
        res.json({ avatar: req.file.path });
    } catch (error) {
        res.status(500).json({ message: "Errore durante l'upload" });
    }
});


loginRouter.post('/registrazione', register)
loginRouter.post('/login', login)

//GOOGLE


loginRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

loginRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // Qui Passport ha già messo l'utente dentro req.user
        const payload = { id: req.user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Reindirizziamo l'utente al frontend passando il token
        // (In produzione è meglio usare un cookie, ma per il Capstone il query param è più semplice)
        res.redirect(`http://localhost:5173/login-success?token=${token}`);
    }
);


export default loginRouter