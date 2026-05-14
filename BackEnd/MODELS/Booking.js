import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    struttura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'struttura',
        required: true
    },
    camera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'camera',
        required: true
    },
    utente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    prezzoTotale: {
        type: Number,
        required: true
    },
    stato: {
        type: String,
        enum: ['In attesa', 'Confermata', 'Cancellata', 'Completata'],
        default: 'In attesa'
    },
    pagato: { type: Boolean, default: false }
}, { timestamps: true });

const booking = mongoose.model("booking", bookingSchema);
export default booking