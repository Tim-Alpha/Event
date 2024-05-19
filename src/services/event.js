import db from '../models/index.js';
const { Event } = db;

const createEvent = async (eventData) => {
    try {
        const event = await Event.create(eventData);
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

const updateEvent = async (eventData, event) => {
    try {
        Object.assign(event, eventData);        
        await event.save();

        return event;
    } catch (error) {
        throw new Error("Failed to update event: " + error);
    }
};

const deleteEvent = async (event) => {
    try {
        const deletedCount = await event.destroy();
        if (deletedCount === 0) {
            throw new Error("Event not found");
        }
    } catch (error) {
        throw new Error("Failed to delete event: " + error);
    }
};

export { createEvent, getAllEvents, getEventByUUID, updateEvent, deleteEvent };
