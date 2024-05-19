import * as eventService from '../services/event.js';
import { response } from '../services/utils.js';
import * as venueService from '../services/venue.js';

const createEvent = async (req, res) => {
    try {
        const { name, description, eventDate, startTime, endTime, venueUUID } = req.body;
        const user = req.user;
        if (!user) {
            res.status(404).json(response("error", "User not logged in"));
        }

        if (name === "") {
            res.status(400).json(response("failed", "Event must have name"));
        }
        const now = new Date();
        const parsedEventDate = new Date(eventDate);
        if (isNaN(parsedEventDate) || parsedEventDate < now) {
            return res.status(400).json(response("failed", "Event date must be a future date"));
        }

        const parsedStartTime = new Date(`${eventDate}T${startTime}`);
        if (isNaN(parsedStartTime) || parsedStartTime.getTime() <= now.getTime()) {
            return res.status(400).json(response("failed", "Start time must be a future time"));
        }

        const parsedEndTime = new Date(`${eventDate}T${endTime}`);
        if (isNaN(parsedEndTime) || parsedEndTime.getTime() <= parsedStartTime.getTime()) {
            return res.status(400).json(response("failed", "End time must be greater than start time"));
        }

        const venue = await venueService.getVenueByUUID(venueUUID);
        if (!venue) {
            return res.status(404).json(response("error", "Venue with uuid not found"));
        }

        const eventData = {
            name: name,
            description: description,
            eventDate: new Date(eventDate),
            startTime: new Date(`${eventDate}T${endTime}`),
            endTime: new Date(`${eventDate}T${endTime}`),
            userId: user.dataValues.id,
            venueId: venue.dataValues.id
        };

        const result = await eventService.createEvent(eventData);
        res.status(200).json(response("success", "Event created successfully", "event", result));     
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));        
    }
}

const getAllEvent = async (req, res) => {
    try {
        const result = await eventService.getAllEvents();
        res.status(200).json(response("success", "Events fetched successfully", "events", result));    
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));    
    }
}

const getEventByUUID = async (req, res) => {
    try {
        let { uuid } = req.query
        if (!uuid) {
            res.status(404).json(response("failed", "Invalid parameter uuid"));
        }
        const result = await eventService.getEventByUUID(uuid);
        res.status(200).json(response("success", "Events fetched successfully", "events", result));    
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));  
    }
}

const updateEventByUUID = async (req, res) => {
    try {
        let uuid = req.params.uuid;
        const { eventData } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json(response("error", "User not logged in"));
        }

        if (!uuid) {
            return res.status(400).json(response("failed", "Missing UUID parameter"));
        }

        let event = await eventService.getEventByUUID(uuid);

        if (!event) {
            return res.status(404).json(response("error", "Event not found"));
        }

        if (user.dataValues.id !== event.dataValues.userId) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        event = await eventService.updateEvent(eventData, event);

        return res.status(200).json(response("success", "Event updated successfully"));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong: " + error));
    }
}

const deleteEventByUUID = async (req, res) => {
    try {
        let uuid = req.params.uuid;
        const user = req.user;

        if (!user) {
            return res.status(401).json(response("error", "User not logged in"));
        }

        if (!uuid) {
            return res.status(400).json(response("failed", "Missing UUID parameter"));
        }

        let event = await eventService.getEventByUUID(uuid);

        if (!event) {
            return res.status(404).json(response("error", "Event not found"));
        }

        if (user.dataValues.id !== event.dataValues.userId) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        const deletedEvent = await eventService.deleteEvent(event);

        if (!deletedEvent) {
            return res.status(404).json(response("error", "Event not found"));
        }

        return res.status(200).json(response("success", "Event deleted successfully"));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong: " + error));
    }
}

export { createEvent, getAllEvent, getEventByUUID, updateEventByUUID, deleteEventByUUID }