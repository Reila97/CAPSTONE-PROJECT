import express from 'express'

import { findAll, findById, canc, update, createNew} from '../CONTROLLERS/servizi.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const serviceRouter = express.Router()

serviceRouter.get('/', findAll) 
serviceRouter.get('/:id', findById) 

serviceRouter.post('/', hasToken, isAdmin, createNew ) 

serviceRouter.delete('/:id', hasToken, isAdmin,canc ) 
serviceRouter.put('/:id', hasToken,isAdmin, update ) 
//serviceRouter.patch('/:id/icona'); 



export default serviceRouter