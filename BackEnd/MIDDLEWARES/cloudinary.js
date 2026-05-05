//file di configuraione del ponte tra express e cloudinary attraverso multer e multer storage (per inviarli a cloudinary)

//multer è il middleware
import multer from "multer";
// la libreria per interagire con cloudinary
import { v2 as cloudinary } from 'cloudinary';
//estensione che permette a multer di parlare con cloudinary
import { CloudinaryStorage } from "multer-storage-cloudinary";
//per il file .env
import dotenv from 'dotenv'
dotenv.config()

//configuro cloudinary globalmente
cloudinary.config({
    //credenziali di cloudinary in .env
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//definisco un nuovo storage
const storageCloudinary = new CloudinaryStorage({
    cloudinary,
    params: {
        //in quale cartella di cloudinary mettere le immagini
        folder: 'VillaFenix',
        //formati permessi
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
})

// creo un oggetto che usa la configurazione qua sopra in modo da poterlo usare nelle rotte
const cloudinaryUploadImg = multer({ storage: storageCloudinary })
export default cloudinaryUploadImg