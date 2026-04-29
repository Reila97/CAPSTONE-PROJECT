import mongoose from "mongoose";


const serviziSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    icona: {type: String}
})
const Servizi = mongoose.model("servizi", serviziSchema)

export default Servizi