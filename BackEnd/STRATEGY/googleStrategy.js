import dotenv from "dotenv"
dotenv.config()

import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import User from "../MODELS/User.js"

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { emails, name, photos, id } = profile;
        const email = emails[0].value;

        // 1. Cerchiamo l'utente
        let user = await User.findOne({ email });

        if (!user) {
            // 2. Se non esiste lo creiamo (senza password, grazie alla funzione 'required' di prima!)
            user = new User({
                googleId: id, // Fondamentale per la logica della password facoltativa
                nome: name.givenName,
                cognome: name.familyName,
                email: email,
                avatar: photos[0].value,
            });
            await user.save();
        } else if (!user.googleId) {
            // Se l'utente esiste (registrato via form) ma usa Google per la prima volta
            user.googleId = id;
            await user.save();
        }
        // 3. Passiamo l'utente a Passport
        // Il primo parametro è l'errore (null), il secondo è l'utente
        return done(null, user);

    } catch (error) {
        // In caso di errore, passiamo l'errore a Passport
        return done(error, null);
    }
}));