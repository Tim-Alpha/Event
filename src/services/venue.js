import db from '../models/index.js';
const { Venue } = db;

const createVenue = async (data) => {
    try {
        data.ownerId = user.id;
        const venue = await Venue.create(data);
        return venue;
    } catch (error) {
        throw new Error('Error in creating venue: ' + error);
    }
}

const getAllVenues = async () => {
    try {
        const venues = await Venue.findAll({
            include: [{
                model: db.User,
                as: 'owner',
                foreignKey: 'ownerId'
            }]
        });
        return venues;
    } catch (error) {
        throw new Error('Error in fetching venues: ' + error)
    }
}

const getVenueByUUID = async (uuid) => {
    try {
        const venue = await Venue.findOne({
            where: { uuid }, 
            include: [{
                model: db.User,
                as: 'owner',
                foreignKey: 'ownerId'
            },
            {
                model: db.Gallery,
                as: "galleries",
                foreignKey: "venueId"
            }, 
            {
                model: db.Event,
                as: "events",
                foreignKey: "venueId"
            }]
        });
        return venue;
    } catch (error) {
        throw new Error('Error in fetching venue: ' + error)
    }
}

const updateVenueByUUID = async (venueData, venue) => {
    try {
        await venue.update(venueData);
        return venue;
    } catch (error) {
        throw new Error('Error in fetching venue: ' + error)
    }
}

const deleteVenueByUUID = async (venue) => {
    try {
        await venue.destroy();
        return venue;
    } catch (error) {
        throw new Error('Error in fetching venue: ' + error)
    }
}

export { createVenue, getAllVenues, getVenueByUUID, updateVenueByUUID, deleteVenueByUUID };