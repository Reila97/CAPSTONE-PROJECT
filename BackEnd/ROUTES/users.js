import express from 'express'

import { findAll, findById } from '../CONTROLLERS/users.js'


const userRouter = express.Router()


userRouter.get('/', findAll) //get di tutti
userRouter.get('/:id', findById) // get del singolo

//userRouter.post('/' ) // elemento nuovo
//
//userRouter.delete('/:id' ) // elimino elemento
//userRouter.put('/:id' ) //modifica elemento
//userRouter.patch('/:id/avatar'); // upload dell'avatar

export default userRouter