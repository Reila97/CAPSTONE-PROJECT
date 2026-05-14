import mongoose from "mongoose";
import Recensioni from "../MODELS/Recensioni.js"


export async function findAll(req, res) {
    try {
        const allReview = await Recensioni.find().populate('user').populate('struttura').populate('camera')
        if (allReview.length === 0) {
            return res.status(404).json({ message: 'non ci sono ancora camere' })
        }
        res.status(200).json(allReview)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function findById(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id Recensioni non valido' })
        }

        const review = await Recensioni.findById(id)
        .populate('user')
        .populate('struttura')
        .populate('camera');
        if (!review) {
            return res.status(404).json({ message: 'Recensione non trovata' })
        }

        res.status(200).json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function canc(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'id Recensioni non valido' })
    }

    const delRecensioni = await Recensioni.findByIdAndDelete(id)
    if (!delRecensioni) {
        return res.status(404).json({ message: 'Recensioni non trovata' })
    }

    res.status(200).json({ message: "Recensioni cancellata" })
}

export async function update(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id Recensioni non valido' })
        }
        const { user, struttura, camera, voto, commento} = req.body


        const updateReview = await Recensioni.findByIdAndUpdate(id,
            { user, struttura, camera, voto, commento} ,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updateReview) {
            return res.status(404).json({ message: "Recensioni non trovata" });
        }

        res.status(200).json(updateReview)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function createNew(req, res) {
    try {
        const newReview = new Recensioni({
            ...req.body,
            user: req.user.id // Sovrascrive l'utente con quello autenticato
        });
        const savedReview = await newReview.save();

        const populatedRecensioni = await Recensioni.findById(savedReview._id).populate('user').populate('struttura').populate('camera');

        res.status(201).json(savedReview); 
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }

}

