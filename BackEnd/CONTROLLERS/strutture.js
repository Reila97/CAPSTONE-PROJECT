import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'

import Strutture from "../MODELS/Strutture.js";


export async function findAll(req, res) {
    try {
        const allProperty = await Strutture.find()
        if (!allProperty) {
            res.status(404).json({ message: 'non ci sono ancora strutture' })
        }
        res.status(200).json(allProperty)
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

        const property = await Strutture.findById(id)
        if (!property) {
            res.status(404).json({ message: 'Struttura non esistente' })
        }

        res.status(200).json(property)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function canc(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'id autore non valido' })
    }

    const delProperty = await Strutture.findOneAndDelete(id)
    if (!delProperty) {
        return res.status(404).json({ message: 'user non trovato' })
    }

    res.status(200).json({ message: "Struttura cancellata" })
}

export async function update(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id autore non valido' })
        }
        const {
            nome,
            descrizione,
            // categoria,
            località,
            contatti,
            policies,
            images
        } = req.body

        const updateProperty = await Strutture.findByIdAndUpdate(id,
            {
                nome,
                descrizione,
                // categoria,
                località,
                contatti,
                policies,
                images
            },
            { returnDocument: 'after' }
        );

        res.status(200).json(updateProperty)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export async function createNew(req, res) {
    try {
        const {
            nome,
            descrizione,
            // categoria,
            località,
            contatti,
            policies,
            images
        } = req.body

        const Property = new Strutture({
            nome,
            descrizione,
            // categoria,
            località,
            contatti,
            policies,
            images
        })

        const newProperty = await Property.save()
        res.status(200).json(newProperty)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}