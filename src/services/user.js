import db from '../models/index.js'; 
const { User } = db;

const createUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw new Error('Error creating the user: ' + error.message);
    }
};

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            include: [{
                model: db.Venue,
                as: 'venues'
            }]
        });

        return users;
    } catch (error) {
        throw new Error('Error in getting all users: ' + error.message);
    }
};

export { createUser, getAllUsers };
