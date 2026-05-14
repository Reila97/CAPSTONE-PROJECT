import mongoose from "mongoose";

const camereSchema = new mongoose.Schema({
    strutturaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'struttura',
        required: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },

    descrizione: {
        type: String,
        required: [true, "La descrizione è obbligatoria"]
    },

    tipologia: {
        type: String,
        required: true,
        enum: ['Singola', 'Doppia', 'Miniappartamento', 'Camera Mansardata'],

    },

    capienza: {
        maxAdulti: {
            type: Number,
            required: true,
            min: 1
        },
        possibilitàLettino: {
            type: Boolean,
            default: false
        }
    },

    servizi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'servizi'
    }],

    prezzoPerNotte: {
        type: Number,
        required: true
    },

    images: {
        mainImage: { type: String },
        gallery: [{ type: String }]
    },

}, { timestamps: true });

camereSchema.index({ strutturaId: 1, nome: 1 }, { unique: true })

const camera = mongoose.model("camera", camereSchema);
export default camera