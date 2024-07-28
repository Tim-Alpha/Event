import * as venueService from '../services/venue.js';
import { response } from '../services/utils.js';

const createVenue = async (req, res) => {
    try {
        const venueData = req.body;
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not logged in"
            });
        }
        const venue = await venueService.createVenue(venueData, user);
        res.status(201).json({
            status: "success",
            message: "Venue created successfully",
            venue: venue
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong! " + error
        });
    }
}

const getAllVenues = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const venueData = await venueService.getAllVenues(page, pageSize);
        res.status(200).json({
            status: "success",
            message: "Venues fetched successfully",
            venues: venueData
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong! " + error.message
        });
    }
}

const getVenueByUUID = async (req, res) => {
    try {
        let { uuid } = req.query;
        let user = req.user;
        console.log("USER: ", user)

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter"));
        }

        const venue = await venueService.getVenueByUUID(uuid, user);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        return res.status(200).json(response("success", "Venue fetched successfully", "venue", venue));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

const updateVenueByUUID = async (req, res) => {
    try {
        let uuid = req.params.uuid;
        let venueData = req.body;
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter"));
        }

        let venue = await venueService.getVenueByUUID(uuid, viewer);

        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        if (!venue.dataValues.owner || viewer.id !== venue.dataValues.owner.id) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        venue = await venueService.updateVenueByUUID(venueData, venue);

        return res.status(200).json(response("success", "Venue updated successfully", "venue", venue));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

const deleteVenueByUUID = async (req, res) => {
    try {
        let { uuid } = req.query;
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter"));
        }

        let venue = await venueService.getVenueByUUID(uuid, viewer);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        if (!venue.dataValues.owner || viewer.id !== venue.dataValues.owner.id) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        const deletedVenue = await venueService.deleteVenueByUUID(venue);
        if (!deletedVenue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        return res.status(200).json(response("success", "Venue deleted successfully"));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

export { createVenue, getAllVenues, getVenueByUUID, updateVenueByUUID, deleteVenueByUUID };
