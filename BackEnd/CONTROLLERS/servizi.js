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
        const { nome, icona, costoExtra } = req.body


        const updateService = await Servizi.findByIdAndUpdate(id,
            { nome, icona, costoExtra },
            { returnDocument: 'after', runValidators: true}
        );

        if (!updateService) {
            return res.status(404).json({ message: "Servizio non trovato" });
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

// aggiungo img
export async function updateIcona(req, res) {
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
        const service = await Servizi.findByIdAndUpdate(
            id, //id dell'autore
            { icona: req.file.path }, // percorso del file
            { returnDocument: 'after' }//ritorn il documento modificato
        )

        //se l'id fornito non esiste, elimino l'img e restituisco errore(404)
        if (!service) {
            // L'autore non esiste, dobbiamo cancellare l'immagine dal cloud
            await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Autore non trovato, immagine rimossa dal cloud' });
        }

        // se ok, restituisco(200)
        res.status(200).json(service)

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



