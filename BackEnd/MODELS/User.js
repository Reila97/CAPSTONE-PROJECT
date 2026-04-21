import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Il nome è obbligatorio"],
        trim: true
    },
    cognome: {
        type: String,
        required: [true, "Il cognome è obbligatorio"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "L'email è obbligatoria"],
        lowercase: true,
        trim: true,
        // Validazione semplice per l'email
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Inserisci un indirizzo email valido']
    },
    password: {
        type: String,
        required: [true, "La password è obbligatoria"],
        minlength: [6, "La password deve essere di almeno 6 caratteri"],
        select: false // Fondamentale: non invia la password nelle query di default
    },
    dataDiNascita: {
        type: Date,
        required: [true, "La data di nascita è obbligatoria"]
    },
    avatar: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function () {
    // 1. Controlla se la password è stata modificata
    if (!this.isModified('password')) {
        return 
    }

    try {
        const salt = await bcrypt.genSalt(12);

        // 3. Hash della password (passando la password e il salt separatamente)
        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        throw(error); // Passa l'errore a Mongoose se qualcosa va storto
    }
});

// Metodo per confrontare la password inserita con quella nel DB
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}


const User = mongoose.model("User", UserSchema)

export default User;