export const isAdmin = (req, res, next) => {
    // req.user viene popolato dal middleware precedente (quello del JWT)
    if (req.user && req.user.isAdmin) {
        next(); // L'utente è admin, può passare!
    } else {
        // 403 Forbidden: L'utente è autenticato ma non ha i permessi
        return res.status(403).json({ message: "Accesso negato: devi essere un amministratore." });
    }
};