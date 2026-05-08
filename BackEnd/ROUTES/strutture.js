import express from 'express'

import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { findAll, findById, canc, update, createNew, updateMainImage, updateGallery} from '../CONTROLLERS/strutture.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const propertyRouter = express.Router()


propertyRouter.get('/', findAll) 
propertyRouter.get('/:id', findById) 

propertyRouter.post('/', hasToken, isAdmin, createNew ) 


propertyRouter.patch('/:id/images',hasToken, isAdmin, cloudinaryUploadImg.single('images'), updateMainImage); 
propertyRouter.patch('/:id/gallery', hasToken, isAdmin, cloudinaryUploadImg.array('gallery',5), updateGallery); 

propertyRouter.delete('/:id', hasToken, isAdmin,canc ) 
propertyRouter.put('/:id', hasToken, isAdmin, update ) 


export default propertyRouter