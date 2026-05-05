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
export async function updateImages(req, res) {
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
        const room = await Camera.findByIdAndUpdate(
            id, //id dell'autore
            { images: req.file.path }, // percorso del file
            { returnDocument: 'after' }//ritorn il documento modificato
        )

        //se l'id fornito non esiste, elimino l'img e restituisco errore(404)
        if (!room) {
            // L'autore non esiste, dobbiamo cancellare l'immagine dal cloud
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Autore non trovato, immagine rimossa dal cloud' });
        }

        // se ok, restituisco(200)
        res.status(200).json(room)

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



