import * as venueService from '../services/venue.js';

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

export { createVenue, getAllVenues };