import mongoose from "mongoose"

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ MongoDB connesso')
    } catch (error) {
        console.error('❌ Errore connessione: ', err)
    }
}


