import db from '../models/index.js';
const { Booking } = db;

// const createBooking = async (bookingData) => {
//     try {
//         const booking = await Booking.create(bookingData);
//         return booking;
//     } catch (error) {
//         throw new Error("Failed to create booking: " + error);
//     }
// };

const getAllBookings = async () => {
    try {
        const bookings = await Booking.findAll({
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            }, {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return bookings;
    } catch (error) {
        throw new Error("Failed to retrieve bookings: " + error);
    }
};

const getBookingByUUID = async (uuid) => {
    try {
        const booking = await Booking.findOne({ 
            where: { uuid },
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            }, {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return booking;
    } catch (error) {
        throw new Error("Failed to retrieve booking: " + error);
    }
};

const updateBooking = async (uuid, bookingData) => {
    try {
        const [updatedCount, updatedBooking] = await Booking.update(bookingData, { where: { uuid }, returning: true });
        if (updatedCount === 0) {
            throw new Error("Booking not found");
        }
        return updatedBooking[0];
    } catch (error) {
        throw new Error("Failed to update booking: " + error);
    }
};

const deleteBooking = async (uuid) => {
    try {
        const deletedCount = await Booking.destroy({ where: { uuid } });
        if (deletedCount === 0) {
            throw new Error("Booking not found");
        }
    } catch (error) {
        throw new Error("Failed to delete booking: " + error);
    }
};

export { createBooking, getAllBookings, getBookingByUUID, updateBooking, deleteBooking };