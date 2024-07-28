import db from '../models/index.js';
const { Venue, User, Gallery, Event } = db;

const createVenue = async (data, user) => {
    try {
        data.ownerId = user.id;
        const venue = await Venue.create(data);
        return venue;
    } catch (error) {
        throw new Error('Error in creating venue: ' + error);
    }
}

const getAllVenues = async (page, pageSize) => {
    try {
        const pageNum = parseInt(page, 10) || 1;
        const pageLimit = parseInt(pageSize, 10) || 10;
        const offset = (pageNum - 1) * pageLimit;

        const { count, rows } = await Venue.findAndCountAll({
            include: [{
                model: User,
                as: 'owner',
                foreignKey: 'ownerId'
            }],
            limit: pageLimit,
            offset: offset,
        });
        const maxPageSize = Math.ceil(count / pageLimit);
        return {
            venues: rows,
            currentPage: pageNum,
            maxPageSize: maxPageSize,
            pageSize: pageLimit,
            totalVenues: count
        };
    } catch (error) {
        throw new Error('Error in fetching venues: ' + error.message);
    }
}

const getVenueByUUID = async (uuid, user) => {
    if (!user || !user.id) {
        throw new Error('Invalid user data');
    }

    try {
        const venue = await Venue.findOne({
            where: { uuid }, 
            include: [{
                model: User,
                as: 'owner',
                foreignKey: 'ownerId'
            },
            {
                model: Gallery,
                as: "galleries",
                foreignKey: "venueId"
            }]
        });

        if (!venue) {
            return null;
        }

        const isOwner = venue.ownerId === user.id;
        const isAdmin = user.role === 'A';

        const events = await Event.findAll({
            where: {
                venueId: venue.id,
                ...(isAdmin ? {} : isOwner ? {} : { userId: user.id })
            },
            order: [['createdAt', 'DESC']]
        });

        venue.dataValues.events = events;

        return venue;
    } catch (error) {
        throw new Error('Error in fetching venue: ' + error);
    }
}


const updateVenueByUUID = async (venueData, venue) => {
    try {
        await venue.update(venueData);
        return venue;
    } catch (error) {
        throw new Error('Error in updating venue: ' + error);
    }
}

const deleteVenueByUUID = async (venue) => {
    try {
        await venue.destroy();
        return venue;
    } catch (error) {
        throw new Error('Error in deleting venue: ' + error);
    }
}

export { createVenue, getAllVenues, getVenueByUUID, updateVenueByUUID, deleteVenueByUUID };
