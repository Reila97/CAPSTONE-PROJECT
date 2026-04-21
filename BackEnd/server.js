import dotenv from "dotenv";
dotenv.config()

import express from "express";
import cors from 'cors';
import passport from "passport";
import { dbConnect } from "./dbConnect.js";

import loginRouter from "./ROUTES/login.js"
import userRouter from "./ROUTES/users.js";

const server = express()
server.use(express.json())

server.use(cors())

server.use(passport.initialize())


// server.js
// ... dopo le importazioni
// console.log("--- DEBUG CONNESSIONE ---");
// console.log("URI dal .env:", process.env.MONGODB_URI);
// console.log("--------------------------");

dbConnect();

server.listen(process.env.PORT, ()=> {
    console.log(`🚀 Server in ascolto sulla porta ${process.env.PORT}`)
})




// Routes
 server.use('/auth', loginRouter)
 server.use('/users', userRouter)



server.get('/', (req,res)=>{
    res.status(200).json({message:"API di Villa Fenix, benvenut*"})
})