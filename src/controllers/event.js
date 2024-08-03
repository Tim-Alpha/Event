import * as eventService from '../services/event.js';
import { response } from '../services/utils.js';
import * as venueService from '../services/venue.js';
import db from '../models/index.js';

const createEvent = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { name, description, eventDate, startTime, endTime, venueUUID } = req.body;
        const user = req.user;
        if (!user) {
            await transaction.rollback();
            return res.status(404).json(response("error", "User not logged in"));
        }

        if (name === "") {
            await transaction.rollback();
            return res.status(400).json(response("failed", "Event must have a name"));
        }
        const now = new Date();
        const parsedEventDate = new Date(eventDate);
        if (isNaN(parsedEventDate) || parsedEventDate < now) {
            await transaction.rollback();
            return res.status(400).json(response("failed", "Event date must be a future date"));
        }

        const parsedStartTime = new Date(`${eventDate}T${startTime}`);
        if (isNaN(parsedStartTime) || parsedStartTime.getTime() <= now.getTime()) {
            await transaction.rollback();
            return res.status(400).json(response("failed", "Start time must be a future time"));
        }

        const parsedEndTime = new Date(`${eventDate}T${endTime}`);
        if (isNaN(parsedEndTime) || parsedEndTime.getTime() <= parsedStartTime.getTime()) {
            await transaction.rollback();
            return res.status(400).json(response("failed", "End time must be greater than start time"));
        }

        const venue = await venueService.getVenueByUUID(venueUUID);
        if (!venue) {
            await transaction.rollback();
            return res.status(404).json(response("error", "Venue with UUID not found"));
        }

        const eventData = {
            name,
            description,
            eventDate: new Date(eventDate),
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            userId: user.dataValues.id,
            venueId: venue.dataValues.id
        };

        const bookingData = {
            status: "pending",
            userId: user.dataValues.id,
            venueId: venue.dataValues.id
        }

        const result = await eventService.createEvent(eventData, bookingData, transaction);
        await transaction.commit();
        return res.status(200).json(response("success", "Event created successfully", "event", result));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(response("error", "ERROR: " + error));
    }
}

const getAllEvents = async (req, res) => {
    try {
        const result = await eventService.getAllEvents();
        return res.status(200).json(response("success", "Events fetched successfully", "events", result));
    } catch (error) {
        return res.status(500).json(response("error", "ERROR: " + error));
    }
}

const getEventByUUID = async (req, res) => {
    try {
        let { uuid } = req.query;
        if (!uuid) {
            return res.status(404).json(response("failed", "Invalid parameter UUID"));
        }
        const result = await eventService.getEventByUUID(uuid);
        return res.status(200).json(response("success", "Events fetched successfully", "events", result));
    } catch (error) {
        return res.status(500).json(response("error", "ERROR: " + error));
    }
}

const getEventsByVenueUUID = async (req, res) => {
    try {
        const venueUUID = req.params.venueUUID;
        const user = req.user;

        if (!user) {
            return res.status(401).json(response("error", "User not logged in"));
        }

        const venue = await venueService.getVenueByUUID(venueUUID);
        if (!venue) {
            return res.status(404).json(response("error", "Venue with UUID not found"));
        }

        let events;
        if (venue.userId === user.dataValues.id) {
            events = await eventService.getEventsByVenueUUID(venueUUID);
        } else {
            events = await eventService.getEventsByVenueUUIDAndUser(venueUUID, user.dataValues.id);
        }

        return res.status(200).json(response("success", "Events fetched successfully", "events", events));
    } catch (error) {
        return res.status(500).json(response("error", "ERROR: " + error));
    }
}

const updateEventByUUID = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        let uuid = req.params.uuid;
        const { eventData } = req.body;
        const user = req.user;

        if (!user) {
            await transaction.rollback();
            return res.status(401).json(response("error", "User not logged in"));
        }

        if (!uuid) {
            await transaction.rollback();
            return res.status(400).json(response("failed", "Missing UUID parameter"));
        }

        let event = await eventService.getEventByUUID(uuid);
        if (!event) {
            await transaction.rollback();
            return res.status(404).json(response("error", "Event not found"));
        }

        if (user.dataValues.id !== event.dataValues.userId) {
            await transaction.rollback();
            return res.status(401).json(response("error", "Unauthorized"));
        }

        event = await eventService.updateEvent(eventData, event, transaction);
        await transaction.commit();
        return res.status(200).json(response("success", "Event updated successfully"));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(response("error", "Something went wrong: " + error));
    }
}

const deleteEventByUUID = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        let uuid = req.params.uuid;
        const user = req.user;

        if (!user) {
            await transaction.rollback();
            return res.status(401).json(response("error", "User not logged in"));
        }

        if (!uuid) {
            await transaction.rollback();
            return res.status(400).json(response("failed", "Missing UUID parameter"));
        }

        let event = await eventService.getEventByUUID(uuid);
        if (!event) {
            await transaction.rollback();
            return res.status(404).json(response("error", "Event not found"));
        }

        if (user.dataValues.id !== event.dataValues.userId) {
            await transaction.rollback();
            return res.status(401).json(response("error", "Unauthorized"));
        }

        const deletedEvent = await eventService.deleteEvent(event, transaction);
        if (!deletedEvent) {
            await transaction.rollback();
            return res.status(404).json(response("error", "Event not found"));
        }

        await transaction.commit();
        return res.status(200).json(response("success", "Event deleted successfully"));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(response("error", "Something went wrong: " + error));
    }
}

export { createEvent, getAllEvents, getEventByUUID, getEventsByVenueUUID, updateEventByUUID, deleteEventByUUID };
