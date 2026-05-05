import express from 'express'

import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { findAll, findById, canc, update, createNew, updateIcona } from '../CONTROLLERS/servizi.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const serviceRouter = express.Router()

serviceRouter.get('/', findAll)

serviceRouter.post('/', hasToken, isAdmin, createNew)

// Rotta per il caricamento "volante" dell'immagine
serviceRouter.post('/temp-upload', hasToken, isAdmin, cloudinaryUploadImg.single('icona'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Nessun file caricato" });
        }
        // Restituiamo l'URL dell'immagine caricata su Cloudinary
        res.status(200).json({ url: req.file.path });
    } catch (error) {
        res.status(500).json({ message: "Errore durante l'upload: " + error.message });
    }
});


serviceRouter.get('/:id', findById)
serviceRouter.delete('/:id', hasToken, isAdmin, canc)
serviceRouter.put('/:id', hasToken, isAdmin, update)

serviceRouter.patch('/:id/icona', hasToken, isAdmin, cloudinaryUploadImg.single('icona'), updateIcona);
// serviceRouter.js





export default serviceRouter