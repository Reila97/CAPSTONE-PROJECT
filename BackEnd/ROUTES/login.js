import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken';

import { login } from "../CONTROLLERS/login.js"
import { register } from '../CONTROLLERS/register.js'


const loginRouter = express.Router()

loginRouter.post('/registrazione', register)
loginRouter.post('/login', login)

//GOOGLE

// Questa è la rotta che il bottone del frontend deve chiamare
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