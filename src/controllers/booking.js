import * as bookingService from '../services/booking.js';
import * as venueService from '../services/venue.js';
import { response } from '../services/utils.js'

const createBooking = async (req, res) => {
    try {
        const bookingData = req.body
        const user = req.user
        if (!user) {
            res.status(404).json(response("failed", "User not found"))
        }

        const venue = await venueService.getVenueByUUID(bookingData.venueUUID);
        if(!venue) {
            res.status(404).json(response("failed", "Venue not found"))
        }

        let userId = user.dataValues.id
        let venueId = venue.dataValues.id
        const data = {...bookingData, userId, venueId}
        
        const booking = await bookingService.createBooking(data);
        res.status(201).json(response("success", "Booked successfully", "booking", booking));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBooking = async (req, res) => {
    try {
        const user = req.user
        const venueUUID = req.query.venueUUID
        if (!user) {
            res.status(404).json(response("failed", "User not found"))
        }
        if(user.dataValues.role !== "OWNER" || user.dataValues.role !== "ADMIN") {
            res.status(401).json(response("failed", "Unauthorized"))
        }

        const bookings = await bookingService.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookingByUUID = async (req, res) => {
    try {
        const uuid = req.query.uuid;
        const user = req.user
        if (!user) {
            res.status(404).json(response("failed", "User not found"))
        }
        const booking = await bookingService.getBookingByUUID(uuid);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
        } else {
            res.status(200).json(booking);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const uuid = req.query.uuid;
        const bookingData = req.body;
        const updatedBooking = await bookingService.updateBooking(uuid, bookingData);
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const uuid = req.query.uuid;
        await bookingService.deleteBooking(uuid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createBooking, getAllBooking, getBookingByUUID, updateBooking, deleteBooking };
