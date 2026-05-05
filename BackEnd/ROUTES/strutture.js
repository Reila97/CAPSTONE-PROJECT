import express from 'express'

import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { findAll, findById, canc, update, createNew, updateimages} from '../CONTROLLERS/strutture.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const propertyRouter = express.Router()


propertyRouter.get('/', findAll) 
propertyRouter.get('/:id', findById) 

propertyRouter.post('/', hasToken, isAdmin, createNew ) 
propertyRouter.delete('/:id', hasToken, isAdmin,canc ) 
propertyRouter.put('/:id', hasToken, isAdmin, update ) 
propertyRouter.patch('/:id/images',hasToken, isAdmin, cloudinaryUploadImg.single('images'), updateimages); 

export default propertyRouter