import db from '../models/index.js';
const { Venue } = db;

const createVenue = async (data) => {
    try {
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

export { createVenue, getAllVenues };