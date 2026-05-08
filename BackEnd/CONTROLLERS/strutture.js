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

// aggiungo img
export async function updateMainImage(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);
            return res.status(400).json({ message: 'ID Strutture non valido' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Nessun file caricato' });
        }

        // USIAMO $set sull'intero oggetto images per "sovrascrivere" la vecchia stringa
        const room = await Strutture.findByIdAndUpdate(
            id,
            {
                $set: {
                    images: {
                        mainImage: req.file.path,
                        gallery: [] // Inizializziamo la gallery se prima era una stringa
                    }
                }
            },
            { returnDocument: 'after' }
        );

        if (!room) {
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Strutture non trovata' });
        }

        res.status(200).json(room);

    } catch (error) {
        if (req.file) await cloudinary.uploader.destroy(req.file.filename);
        console.error("Errore DB:", error);
        res.status(500).json({ message: error.message });
    }
}



export async function updateGallery(req, res) {
    try {
        const { id } = req.params;

        // 1. Controllo validità ID e pulizia file se errato
        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.files) {
                for (const file of req.files) await cloudinary.uploader.destroy(file.filename);
            }
            return res.status(400).json({ message: 'ID Strutture non valido' });
        }

        // 2. Controllo se i file sono arrivati
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Nessun file caricato per la gallery' });
        }

        const newGalleryUrls = req.files.map(file => file.path);

        // 3. RECUPERO DELLA Strutture
        // Dobbiamo verificare se 'images' è una stringa o un oggetto prima di fare il push
        const currentRoom = await Strutture.findById(id);

        if (!currentRoom) {
            for (const file of req.files) await cloudinary.uploader.destroy(file.filename);
            return res.status(404).json({ message: 'Strutture non trovata' });
        }

        let updateQuery;

        // 4. LOGICA DI CORREZIONE STRUTTURA
        // Se 'images' è una stringa (vecchio formato), sovrascriviamo tutto l'oggetto
        if (typeof currentRoom.images === 'string') {
            updateQuery = {
                $set: {
                    images: {
                        mainImage: currentRoom.images, // Salviamo la vecchia stringa come mainImage
                        gallery: newGalleryUrls        // Inizializziamo la gallery con i nuovi file
                    }
                }
            };
        } else {
            // Se è già un oggetto, usiamo il $push standard
            updateQuery = {
                $push: { "images.gallery": { $each: newGalleryUrls } }
            };
        }

        const room = await Strutture.findByIdAndUpdate(
            id,
            updateQuery,
            { returnDocument: 'after' }
        );

        res.status(200).json(room);

    } catch (error) {
        // 5. Pulizia Cloudinary in caso di crash
        if (req.files) {
            for (const file of req.files) {
                try { await cloudinary.uploader.destroy(file.filename); } catch (e) { }
            }
        }
        console.error("Errore Gallery:", error);
        res.status(500).json({ message: error.message });
    }
}