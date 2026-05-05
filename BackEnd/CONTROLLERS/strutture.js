import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary'

import Strutture from "../MODELS/Strutture.js";


export async function findAll(req, res) {
    try {
        const allProperty = await Strutture.find()
        if (!allProperty) {
           return res.status(404).json({ message: 'non ci sono ancora strutture' })
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

        const property = await Strutture.findById(id).populate('camere')
        if (!property) {
            return res.status(404).json({ message: 'Struttura non esistente' })
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

    const delProperty = await Strutture.findByIdAndDelete(id)
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
            località,
            contatti,
            policies,
            images
        } = req.body

        const updateProperty = await Strutture.findByIdAndUpdate(id,
            {
                nome,
                descrizione,
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
            località,
            contatti,
            policies,
            images
        } = req.body

        const Property = new Strutture({
            nome,
            descrizione,
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

export async function updateimages(req, res) {
    try {
        //controllo id
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Se l'ID è sbagliato ma il file è già arrivato, lo eliminiamo subito
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);

            return res.status(400).json({ message: 'id autore non valido,, immagine rimossa dal cloud' })
        }

        //quando l'utente carica l'immagine, se il caricamento va a buon fine Express aggiunge req.file, quindi controllo che questo parametro ci sia, in caso contrario avviso che non c'è
        if (!req.file) {
            return res.status(400).json({ message: 'file non caricato' })
        }

        //colleghiamo il file caricato all'autore, aggiorno il database
        const property = await Strutture.findByIdAndUpdate(
            id, //id dell'autore
            { images: req.file.path }, // percorso del file
            { returnDocument: 'after' }//ritorn il documento modificato
        )

        //se l'id fornito non esiste, elimino l'img e restituisco errore(404)
        if (!property) {
            // L'autore non esiste, dobbiamo cancellare l'immagine dal cloud
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Autore non trovato, immagine rimossa dal cloud' });
        }

        // se ok, restituisco(200)
        res.status(200).json(property)

    } catch (error) {
        // provo a pulire Cloudinary
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cloudinaryError) {
                // Non blocco il flusso e rispondo al client
                console.error("Errore durante la pulizia del file:", cloudinaryError);
            }
        }
        //  rispondo al cliente
        res.status(500).json({
            message: error.message + ', abbiamo tentato di rimuovere l\'immagine dal cloud'
        });
    }
}



