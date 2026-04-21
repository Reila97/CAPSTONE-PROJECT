import mongoose from "mongoose";
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
            return res.status(400).json({ message: 'id autore non valido' })
        }

        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User non esistente' })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}