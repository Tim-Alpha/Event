import express from 'express';
import * as bookingController from '../controllers/booking.js';
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/booking/create', middleware.verifyToken, bookingController.createBooking);
router.get('/booking/getAll', middleware.verifyToken, bookingController.getAllBooking);
router.get('/booking/getByUUID', middleware.verifyToken, bookingController.getBookingByUUID);
router.put('/booking/update', middleware.verifyToken, bookingController.updateBooking);
router.delete('/booking/delete', middleware.verifyToken, bookingController.deleteBooking);

export default router;
