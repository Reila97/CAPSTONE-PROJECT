import User from "../MODELS/User.js";

export async function register(req, res) {
    try {
        const { nome, cognome, email, password, dataDiNascita, avatar } = req.body;

        // 1. Validazione base (Opzionale ma consigliata)
        if (!nome || !email || !password) {
            return res.status(400).json({ message: "Nome, email e password sono obbligatori" });
        }

        // 2. Controllo se l'utente esiste
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "L'email è già registrata" });
        }

        // 3. Creazione nuovo utente
        // Nota: la password verrà criptata dal middleware .pre('save') nel tuo modello User
        const newUser = new User({
            nome,
            cognome,
            email,
            password,
            dataDiNascita,
            avatar 
        });

        // 4. Salva e ritorna (Usa return per sicurezza)
        await newUser.save();
        return res.status(201).json({ message: "Utente creato con successo" });

    } catch (error) {
        console.error("ERRORE REGISTRAZIONE:", error);

        // Se l'errore è una violazione di "unique" (es. email) non gestita prima
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email già in uso" });
        }

        return res.status(500).json({ message: "Errore durante la registrazione dell'utente" });
    }
}