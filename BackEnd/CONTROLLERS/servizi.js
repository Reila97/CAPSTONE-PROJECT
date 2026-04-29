import mongoose from "mongoose";
import Servizi from "../MODELS/Servizi.js";

export async function findAll(req, res) {
    try {
        const allService = await Servizi.find()
        if (allService.length === 0) {
            return res.status(404).json({ message: 'non ci sono ancora servizi' })
        }
        res.status(200).json(allService)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function findById(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id servizio non valido' })
        }

        const servizio = await Servizi.findById(id);
        if (!servizio) {
            return res.status(404).json({ message: 'servizio non trovato' })
        }

        res.status(200).json(servizio)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function canc(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'id servizio non valido' })
    }

    const delService = await Servizi.findByIdAndDelete(id)
    if (!delService) {
        return res.status(404).json({ message: 'servizio non trovato' })
    }

    res.status(200).json({ message: "Servizio cancellata" })
}

export async function update(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id camera non valido' })
        }
        const { nome, icona } = req.body


        const updateService = await Servizi.findByIdAndUpdate(id,
            req.body,
            { returnDocument: 'after', runValidators: true}
        );

        if (!updateService) {
            return res.status(404).json({ message: "Camera non trovata" });
        }

        res.status(200).json(updateService)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function createNew(req, res) {
   try {
        const newService = new Servizi(req.body);
        const savedService = await newService.save();
        res.status(201).json(savedService); 
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }

}