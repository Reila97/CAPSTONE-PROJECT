import mongoose from "mongoose";

const recensioniSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  struttura: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'struttura',
    required: true
  },
  camera: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'camera',
  },
  voto: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commento: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Evitiamo che un utente lasci più di una recensione per la stessa struttura
recensioniSchema.index({ user: 1, struttura: 1 }, { unique: true });



const recensioni = mongoose.model("recensioni", recensioniSchema);
export default recensioni;