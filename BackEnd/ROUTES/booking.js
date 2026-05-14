import express from 'express';
import { getMyBookings, createBooking, update, cancelBooking, getAll, getById } from '../CONTROLLERS/booking.js';
import { hasToken } from '../MIDDLEWARES/hasToken.js'
import { isAdmin } from '../MIDDLEWARES/isAdmin.js';

const bookingRouter = express.Router();

// Crea una nuova prenotazione
bookingRouter.post ('/', hasToken, createBooking)
// Visualizza le prenotazioni dell'utente loggato
bookingRouter.get ('/my-booking', hasToken, getMyBookings)
// Modifica una prenotazione esistente
bookingRouter.put ('/:id', hasToken, update)
// Cancella (soft delete) una prenotazione
bookingRouter.patch('/:id/cancel', hasToken, isAdmin, cancelBooking)

bookingRouter.get('/all', hasToken, isAdmin, getAll)
bookingRouter.get('/:id', hasToken, isAdmin, getById)

export default bookingRouter