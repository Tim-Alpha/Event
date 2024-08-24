import { Op } from 'sequelize';
import db from '../models/index.js';
const { User, Venue } = db;

const SearchUsers = async (mixed, page, pageSize) => {
    try {
        const pageNum = parseInt(page) || 1;
        const pageLimit = parseInt(pageSize) || 10;
        const offset = (pageNum - 1) * pageLimit;

        const { count, rows } = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${mixed}%` } },
                    { firstName: { [Op.like]: `%${mixed}%` } },
                    { lastName: { [Op.like]: `%${mixed}%` } }
                ]
            },
            include: [{
                model: Venue,
                as: 'venues'
            }],
            limit: pageLimit,
            offset: offset
        });

        const maxPageSize = Math.min(count - offset, pageLimit);
        return {
            currentPage: pageNum,
            maxPageSize: (maxPageSize < 0) ? 0 : maxPageSize,
            pageSize: pageLimit,
            totalUsers: count,
            users: rows,
        };
    } catch (error) {
        throw new Error('Error in searching the users: ' + error.message);
    }
};

const SearchVenues = async (mixed, page, pageSize) => {
    try {
        const pageNum = parseInt(page) || 1;
        const pageLimit = parseInt(pageSize || 10);
        const offset = (pageNum - 1) * pageLimit;

        const { count, rows } = await Venue.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${mixed}%` } },
                    { location: { [Op.like]: `%${mixed}%` } },
                    { description: { [Op.like]: `%${mixed}%` } }
                ]
            },
            include: [{
                model: User,
                as: 'owner',
                foreignKey: 'ownerId'
            }],
            limit: pageLimit,
            offset: offset
        });

        const maxPageSize = Math.min(count - offset, pageLimit);
        return {
            currentPage: pageNum,
            maxPageSize: (maxPageSize < 0) ? 0 : maxPageSize,
            pageSize: pageLimit,
            totalVenues: count,
            venues: rows,
        };
    } catch (error) {
        throw new Error('Error in searching the venues: ' + error.message);
    }
};

export { SearchUsers, SearchVenues };
