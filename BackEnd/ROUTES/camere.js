import express from 'express'

import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { findAll, findById, canc, update, createNew, updateImages} from '../CONTROLLERS/camere.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const roomRouter = express.Router()

roomRouter.get('/', findAll) 
roomRouter.get('/:id', findById) 

roomRouter.post('/', hasToken, isAdmin, createNew ) 

roomRouter.delete('/:id', hasToken, isAdmin,canc ) 
roomRouter.put('/:id', hasToken,isAdmin, update ) 
roomRouter.patch('/:id/images', hasToken, isAdmin, cloudinaryUploadImg.single('images'), updateImages); 



export default roomRouter