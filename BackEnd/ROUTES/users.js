import express from 'express'

import { findAll, findById, canc, update} from '../CONTROLLERS/users.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const userRouter = express.Router()


userRouter.get('/', findAll) 
userRouter.get('/:id', findById) 

//userRouter.post('/' ) // elemento nuovo
//
userRouter.delete('/:id', hasToken, isAdmin,canc ) 
userRouter.put('/:id', hasToken, isAdmin, update ) 
//userRouter.patch('/:id/avatar'); 

export default userRouter