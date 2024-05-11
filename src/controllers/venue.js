import * as venueService from '../services/venue.js';
import { response } from '../services/utils.js';

const createVenue = async (req, res) => {
    try {
        const venueData = req.body;
        const venue = await venueService.createVenue(venueData);
        res.status(201).json({
            "status": "success",
            "message": "Venue created successfully",
            "venue": venue
        });
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": "Something went wrong!" + error
        });
    }
}

const getAllVenues = async (req, res) => {
    try {
        const venueData = await venueService.getAllVenues();
        res.status(200).json({
            "status": "success",
            "message": "Venues fetched successfully",
            "venues": venueData
        });
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": "Something went wrong!" + error
        });        
    }
}

const getVenueByUUID = async (req, res) => {
    try {
        let { uuid } = req.query;

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter", null, null));
        }
        
        const venue = await venueService.getVenueByUUID(uuid);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found", null, null));
        }

        return res.status(200).json(response("success", "Venue fetched successfully", "venue", venue))
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong!" + error, null, null)); 
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

        let venue = await venueService.getVenueByUUID(uuid);

        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }
        
        if (!venue.dataValues.owner || viewer.dataValues.uuid !== venue.dataValues.owner.uuid) {
            return res.status(401).json(response("error", "Unauthorized"));
        }
        
        venue = await venueService.updateVenueByUUID(venueData, venue);

        return res.status(200).json(response("success", "Venue updated successfully", "venue", venue))
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong!" + error)); 
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
        
        let venue = await venueService.getVenueByUUID(uuid);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }
        
        if (!venue.dataValues.owner || viewer.dataValues.uuid !== venue.dataValues.owner.uuid) {
            return res.status(401).json(response("error", "Unauthorized"));
        }
        
        const deletedVenue = venueService.deleteVenueByUUID(venue);
        if (!deletedVenue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        return res.status(200).json(response("success", "Venue deleted successfully"))
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong!" + error)); 
    }
}


export { createVenue, getAllVenues, getVenueByUUID, updateVenueByUUID, deleteVenueByUUID };