import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary"
import Camera from "../MODELS/Camere.js";


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
            { returnDocument: 'after', runValidators: true }
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

        const populatedCamera = await Camera.findById(savedRoom._id).populate('strutturaId');

        res.status(201).json(savedRoom); // 201 è lo status corretto per "Created"
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 se i dati non rispettano lo schema
    }

}

// aggiungo img
export async function updateMainImage(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);
            return res.status(400).json({ message: 'ID camera non valido' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Nessun file caricato' });
        }

        // USIAMO $set sull'intero oggetto images per "sovrascrivere" la vecchia stringa
        const room = await Camera.findByIdAndUpdate(
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
            return res.status(404).json({ message: 'Camera non trovata' });
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
            return res.status(400).json({ message: 'ID camera non valido' });
        }

        // 2. Controllo se i file sono arrivati
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Nessun file caricato per la gallery' });
        }

        const newGalleryUrls = req.files.map(file => file.path);

        // 3. RECUPERO DELLA CAMERA
        // Dobbiamo verificare se 'images' è una stringa o un oggetto prima di fare il push
        const currentRoom = await Camera.findById(id);
        
        if (!currentRoom) {
            for (const file of req.files) await cloudinary.uploader.destroy(file.filename);
            return res.status(404).json({ message: 'Camera non trovata' });
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

        const room = await Camera.findByIdAndUpdate(
            id,
            updateQuery,
            { returnDocument: 'after' }
        );

        res.status(200).json(room);

    } catch (error) {
        // 5. Pulizia Cloudinary in caso di crash
        if (req.files) {
            for (const file of req.files) {
                try { await cloudinary.uploader.destroy(file.filename); } catch (e) {}
            }
        }
        console.error("Errore Gallery:", error);
        res.status(500).json({ message: error.message });
    }
}