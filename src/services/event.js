import db from '../models/index.js';
const { Event, Booking } = db;

const createEvent = async (eventData, bookingData, transaction) => {
    try {
        const event = await Event.create(eventData, { transaction });
        const booking = await Booking.create(bookingData, { transaction });
        return event;
    } catch (error) {
        throw new Error("Failed to create event: " + error);
    }
};

const getAllEvents = async () => {
    try {
        const events = await Event.findAll({
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId' 
            },
            {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return events;
    } catch (error) {
        throw new Error("Failed to retrieve events: " + error);
    }
};

const getEventByUUID = async (uuid) => {
    try {
        const event = await Event.findOne({ 
            where: { uuid },
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            },
            {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return event;
    } catch (error) {
        throw new Error("Failed to retrieve event: " + error);
    }
};

const getEventsByVenueUUID = async (venueUUID) => {
    try {
        const events = await Event.findAll({
            where: { venueId: venueUUID },
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            },
            {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return events;
    } catch (error) {
        throw new Error("Failed to retrieve events: " + error);
    }
};

const getEventsByUser = async (userId) => {
    try {
        const events = await Event.findAll({
            where: {
                userId: userId
            },
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            },
            {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return events;
    } catch (error) {
        throw new Error("Failed to retrieve events: " + error);
    }
};

const updateEvent = async (eventData, event, transaction) => {
    try {
        Object.assign(event, eventData);
        await event.save({ transaction });
        return event;
    } catch (error) {
        throw new Error("Failed to update event: " + error);
    }
};

const deleteEvent = async (event, transaction) => {
    try {
        const deletedCount = await event.destroy({ transaction });
        if (deletedCount === 0) {
            throw new Error("Event not found");
        }
        return deletedCount;
    } catch (error) {
        throw new Error("Failed to delete event: " + error);
    }
};

export { createEvent, getAllEvents, getEventByUUID, getEventsByVenueUUID, getEventsByUser, updateEvent, deleteEvent };
