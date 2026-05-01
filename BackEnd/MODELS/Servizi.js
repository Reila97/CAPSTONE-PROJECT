import mongoose from "mongoose";


const serviziSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    icona: String,
    costoExtra: Number
})
const Servizi = mongoose.model("servizi", serviziSchema)

export default Servizi