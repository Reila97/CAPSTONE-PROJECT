import mongoose from 'mongoose';
import Booking from '../MODELS/Booking.js';
import Camera from '../MODELS/Camere.js';

/**
 * 1. CREAZIONE PRENOTAZIONE
 * Gestisce la logica di calcolo prezzo, verifica disponibilità e salvataggio.
 */
export async function createBooking(req, res) {
    try {
        const { struttura, camera, checkIn, checkOut } = req.body;
        const utente = req.user._id;

        // Validazione ID
        if (!mongoose.Types.ObjectId.isValid(struttura) || !mongoose.Types.ObjectId.isValid(camera)) {
            return res.status(400).json({ message: "ID struttura o camera non valido." });
        }

        const dataInizio = new Date(checkIn);
        const dataFine = new Date(checkOut);
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0); // Reset orario per confronto date

        // Validazione Date (Anti-passato e logica check-in/out)
        if (dataInizio < oggi) {
            return res.status(400).json({ message: "Non puoi prenotare una data nel passato." });
        }
        if (dataInizio >= dataFine) {
            return res.status(400).json({ message: "La data di check-out deve essere successiva al check-in." });
        }

        // Controllo Disponibilità (Anti-Overlap)
        const conflict = await Booking.findOne({
            camera: camera,
            stato: { $ne: 'Cancellata' },
            $or: [{ checkIn: { $lt: dataFine }, checkOut: { $gt: dataInizio } }]
        });

        if (conflict) {
            return res.status(409).json({ message: "La camera non è disponibile per queste date." });
        }

        // Recupero info camera e calcolo prezzo
        const cameraInfo = await Camera.findById(camera);
        if (!cameraInfo) return res.status(404).json({ message: "Camera non trovata." });

        const notti = Math.ceil((dataFine - dataInizio) / (1000 * 60 * 60 * 24));
        
        const nuovaPrenotazione = new Booking({
            struttura,
            camera,
            utente,
            checkIn: dataInizio,
            checkOut: dataFine,
            prezzoTotale: notti * cameraInfo.prezzo,
            stato: 'In attesa'
        });

        await nuovaPrenotazione.save();
        res.status(201).json({ success: true, data: nuovaPrenotazione });

    } catch (error) {
        res.status(500).json({ message: "Errore durante la creazione." });
    }
}

/**
 * 2. RECUPERO PRENOTAZIONI UTENTE
 * Lista storica per il profilo utente con populate annidato.
 */
export async function getMyBookings(req, res) {
    try {
        const bookings = await Booking.find({ utente: req.user._id })
            .populate('struttura', 'nome località.indirizzo località.città')
            .populate('camera', 'nome tipologia')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero prenotazioni." });
    }
}

/**
 * 3. CANCELLAZIONE PRENOTAZIONE (Soft Delete)
 * Cambia lo stato invece di eliminare, con controllo temporale (24h prima).
 */
export async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID non valido." });
        }

        const prenotazione = await Booking.findById(id);
        if (!prenotazione) return res.status(404).json({ message: "Prenotazione non trovata." });

        // Sicurezza: solo proprietario o admin
        if (prenotazione.utente.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
            return res.status(403).json({ message: "Azione non autorizzata." });
        }

        // Controllo 24h prima
        const adesso = new Date();
        const limiteCancellazione = new Date(prenotazione.checkIn);
        limiteCancellazione.setHours(limiteCancellazione.getHours() - 24);

        if (adesso > limiteCancellazione && req.user.isAdmin !== true) {
            return res.status(400).json({ message: "Impossibile cancellare: mancano meno di 24h al check-in." });
        }

        prenotazione.stato = 'Cancellata';
        await prenotazione.save();

        res.json({ success: true, message: "Prenotazione cancellata." });
    } catch (error) {
        res.status(500).json({ message: "Errore durante la cancellazione." });
    }
}

/**
 * 4. MODIFICA PRENOTAZIONE
 * Permette il cambio date con ricalcolo e controllo collisioni (escludendo se stessa).
 */
export async function update(req, res) {
    try {
        const { id } = req.params;
        const { checkIn, checkOut } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID non valido." });

        let prenotazione = await Booking.findById(id);
        if (!prenotazione) return res.status(404).json({ message: "Prenotazione non trovata." });

        if (prenotazione.utente.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
            return res.status(403).json({ message: "Azione non autorizzata." });
        }

        const dataInizio = new Date(checkIn);
        const dataFine = new Date(checkOut);

        // Controllo disponibilità ESCLUDENDO la prenotazione attuale
        const conflict = await Booking.findOne({
            _id: { $ne: id },
            camera: prenotazione.camera,
            stato: { $ne: 'Cancellata' },
            $or: [{ checkIn: { $lt: dataFine }, checkOut: { $gt: dataInizio } }]
        });

        if (conflict) return res.status(409).json({ message: "Date già occupate." });

        const cameraInfo = await Camera.findById(prenotazione.camera);
        const notti = Math.ceil((dataFine - dataInizio) / (1000 * 60 * 60 * 24));

        prenotazione.checkIn = dataInizio;
        prenotazione.checkOut = dataFine;
        prenotazione.prezzoTotale = notti * cameraInfo.prezzo;

        await prenotazione.save();
        res.json({ success: true, data: prenotazione });
    } catch (error) {
        res.status(500).json({ message: "Errore durante l'aggiornamento." });
    }
}

/**
 * 5. GESTIONE DISPONIBILITÀ (Query Ottimizzata)
 * Restituisce le date occupate per una camera specifica per aiutare il calendario React.
 */
export async function getBusyDates(req, res) {
    try {
        const { cameraId } = req.params;

        const bookings = await Booking.find({
            camera: cameraId,
            stato: { $ne: 'Cancellata' },
            checkOut: { $gte: new Date() } // Solo prenotazioni future o in corso
        }).select('checkIn checkOut -_id');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero disponibilità." });
    }
}

/**
 * 6. FIND ALL (Per il Gestionale Admin)
 * Recupera tutte le prenotazioni del sistema con filtri opzionali.
 */
export async function getAll(req, res) {
    try {
        // Solo l'admin può accedere (controllo già presente nel middleware o qui)
        if (req.user.isAdmin !== true) {
            return res.status(403).json({ message: "Accesso negato. Solo Admin." });
        }

        const bookings = await Booking.find()
            .populate('utente', 'nome cognome email') // Chi ha prenotato?
            .populate('struttura', 'nome')            // In quale struttura?
            .populate('camera', 'nome')               // In quale camera?
            .sort({ checkIn: 1 });                    // Ordinate per data di arrivo

        res.json({
            success: true,
            results: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero del gestionale." });
    }
}

/**
 * 7. FIND BY ID (Dettaglio Prenotazione)
 * Recupera i dati completi di una singola prenotazione.
 */
export async function getById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID prenotazione non valido." });
        }

        const prenotazione = await Booking.findById(id)
            .populate('utente', 'nome cognome email')
            .populate('struttura', 'nome località')
            .populate('camera', 'nome tipologia prezzo');

        if (!prenotazione) {
            return res.status(404).json({ message: "Prenotazione non trovata." });
        }

        // Sicurezza: l'utente può vedere solo la sua, l'Admin può vedere tutto
        if (prenotazione.utente._id.toString() !== req.user._id.toString() && req.user.isAdmin !== true) {
            return res.status(403).json({ message: "Non sei autorizzato a vedere questa prenotazione." });
        }

        res.json({ success: true, data: prenotazione });
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero del dettaglio." });
    }
}