import express from 'express'

import cloudinaryUploadImg from '../MIDDLEWARES/cloudinary.js'
import { findAll, findById, canc, update, createNew, updateAvatar} from '../CONTROLLERS/users.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const userRouter = express.Router()

//CHI SONO IO?
userRouter.get('/me', hasToken, (req, res) => {
    res.json(req.user);
});


userRouter.get('/', findAll) 
userRouter.get('/:id', findById) 

userRouter.post('/', createNew ) // elemento nuovo

userRouter.delete('/:id', hasToken, isAdmin,canc ) 
userRouter.put('/:id', hasToken, update ) 
userRouter.patch('/:id/avatar', hasToken, cloudinaryUploadImg.single('avatar'), updateAvatar); 



export default userRouter