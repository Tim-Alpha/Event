import { parse } from 'path';
import db from '../models/index.js';
const { Venue } = db;

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
                model: db.User,
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
            }]
        });

        if (!venue) {
            return null;
        }

        const isOwner = venue.ownerId === user.id;

        const events = await db.Event.findAll({
            where: {
                venueId: venue.id,
                ...(isOwner ? {} : { createdBy: user.id })
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