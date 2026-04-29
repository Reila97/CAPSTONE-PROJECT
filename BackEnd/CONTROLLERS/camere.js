import mongoose from "mongoose";
import Camera from "../MODELS/Camere.js";
import Servizi from "../MODELS/Servizi.js";

export async function findAll(req, res) {
    try {
        const allRoom = await Camera.find().populate('strutturaId').populate('servizi')
        if (allRoom.length === 0) {
            return res.status(404).json({ message: 'non ci sono ancora camere' })
        }
        res.status(200).json(allRoom)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function findById(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id camera non valido' })
        }

        const camera = await Camera.findById(id).populate('strutturaId servizi');
        if (!camera) {
            return res.status(404).json({ message: 'Camera non trovata' })
        }

        res.status(200).json(camera)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function canc(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'id camera non valido' })
    }

    const delCamera = await Camera.findByIdAndDelete(id)
    if (!delCamera) {
        return res.status(404).json({ message: 'Camera non trovata' })
    }

    res.status(200).json({ message: "Camera cancellata" })
}

export async function update(req, res) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'id camera non valido' })
        }
        const { strutturaId, nome, descrizione, tipologia, capienza, servizi, prezzoPerNotte, images } = req.body


        const updateRoom = await Camera.findByIdAndUpdate(id,
            req.body,
            { returnDocument: 'after', runValidators: true}
        );

        if (!updateRoom) {
            return res.status(404).json({ message: "Camera non trovata" });
        }

        res.status(200).json(updateRoom)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function createNew(req, res) {
   try {
        const newRoom = new Camera(req.body);
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom); // 201 è lo status corretto per "Created"
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 se i dati non rispettano lo schema
    }

}