import express from 'express'

import { findAll, findById, canc, update, createNew} from '../CONTROLLERS/recensioni.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'


const recensioniRouter = express.Router()

recensioniRouter.get('/', findAll) 
recensioniRouter.get('/:id', findById) 

recensioniRouter.post('/', hasToken, isAdmin, createNew ) 
recensioniRouter.delete('/:id', hasToken, isAdmin,canc ) 
recensioniRouter.put('/:id', hasToken,isAdmin, update ) 




export default recensioniRouter