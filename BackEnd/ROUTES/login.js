import express from 'express'
import passport from 'passport'

import {login} from "../CONTROLLERS/login.js"
import { register } from '../CONTROLLERS/register.js'
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js'

const loginRouter = express.Router()

loginRouter.post('/registrazione', register)
loginRouter.post('/login', login)


export default loginRouter