import mongoose from "mongoose";

const strutturaSchema = new mongoose.Schema(
  {
    // 1. INFORMAZIONI DI BASE (IDENTITY)
    nome: {
      type: String,
      required: [true, "Il nome della struttura è obbligatorio"],
      trim: true
    },
   
    descrizione: {
      type: String,
      required: [true, "La descrizione è obbligatoria"]
    },
  
    // 2. LOCALIZZAZIONE
    località: {
      indirizzo: { type: String, required: true },
      città: { type: String, required: true },
      provincia: { type: String, required: true },
      zipCode: { type: String, required: true },//cap
      //TODO
      //   coordinates: {
      //     lat: { type: Number, required: true },
      //     lng: { type: Number, required: true }
      // }
    },

    // 3. CONTATTI E GESTIONE
    contatti: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      telefono: { type: String, required: true },
      manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
      }
    },

    // 4. MEDIA E VISUAL
    images: {
      mainImage: { type: String },
      gallery: [{ type: String }]
    },

    // 5. POLITICHE E PREZZI BASE
    policies: {
      checkIn: { type: String, default: "14:00" },
      checkOut: { type: String, default: "10:00" },
      cancellation: {
        type: String,
        enum: ["Flessibile", "Moderata", "Rigorosa"],
        default: "Flessibile"
      },
      basePrice: {
        type: Number,
        required: true,
        min: 0 // Prezzo minimo di partenza della struttura
      }
    },

    //TODO
    // RATING (Dati calcolati o aggiornati dalle recensioni)
    //rating: { type: Number, default: 0, min: 0, max: 5 },
    // reviewsCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

//TODO
// Indice per velocizzare le ricerche per città o nome
//strutturaSchema.index({ "località.città": 1, nome: 1 });

// Consente di vedere i campi virtuali quando converti il documento in JSON o Oggetto
strutturaSchema.set('toJSON', { virtuals: true });
strutturaSchema.set('toObject', { virtuals: true });

// Definisci il campo virtuale 'camere'
strutturaSchema.virtual('camere', {
  ref: 'camera',         // Il modello da cercare
  localField: '_id',     // Il campo in questo modello (Struttura)
  foreignField: 'strutturaId' // Il campo nel modello Camera che punta alla struttura
});

const strutture = mongoose.model("struttura", strutturaSchema);

export default strutture;