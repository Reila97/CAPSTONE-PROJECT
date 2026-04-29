import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import User from "../MODELS/User.js";

export async function findAll(req, res) {
    try {
        const allUsers = await User.find()
        if (!allUsers) {
            res.status(404).json({ message: 'non ci sono ancora utenti loggati' })
        }
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function findById(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id struttura non valido' })
        }

        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'Struttura non esistente' })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function canc(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'id struttura non valido' })
    }

    const delUser = await User.findByIdAndDelete(id)
    if (!delUser) {
        return res.status(404).json({ message: 'user non trovato' })
    }

    res.status(200).json({ message: "user cancellato" })
}

export async function update(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id struttura non valido' })
        }
        const { nome, cognome, email, dataDiNascita, password, avatar, isAdmin } = req.body


        if (password) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt)
            User.password = hashedPassword
        }

        const updateUser = await User.findByIdAndUpdate(id,
            { nome, cognome, email, dataDiNascita, password, avatar, isAdmin },
            { returnDocument: 'after' }
        ).select("-password");

        if (!updateUser) {
            return res.status(404).json({ message: "Utente non trovato" });
        }

        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function createNew(req, res) {
    try {
        const {
            nome,
            cognome,
            email,
            password,
            dataDiNascita,
            avatar
        } = req.body

        const user = new User({
            nome,
            cognome,
            email,
            password,
            dataDiNascita,
            avatar
        })

        const newUser = await user.save()
        res.status(200).json(newUser)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}