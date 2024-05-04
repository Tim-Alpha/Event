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

const getUserByUUID = async (uuid) => {
    try {
        const user = await User.findOne({
            where: { uuid }, 
            include: [{
                model: db.Venue,
                as: 'venues'
            }]
        });
        return user;
    } catch (error) {
        throw new Error('Error while fetching user by uuid: ' + error);
    }
}

const updateUserByUUID = async (userData, uuid) => {
    try {
        await User.update(userData, { where: { uuid } });
        const updatedUser = await User.findOne({ where: { uuid } });
        return updatedUser;
    } catch (error) {
        throw new Error('Error while updating user by UUID: ' + error.message);
    }
}

const deleteUserByUUID = async (uuid) => {
    try {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            throw new Error('User not found');
        }
        // Soft delete the user
        await user.destroy();
        return user;
    } catch (error) {
        throw new Error('Error while deleting user by uuid: ' + error.message);
    }
}

const forceDeleteUserByUUID = async (uuid) => {
    try {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            throw new Error('User not found');
        }

        // Hard delete the user
        await user.destroy({ force: true });
        return user;
    } catch (error) {
        throw new Error('Error while deleting user by uuid: ' + error.message);
    }
}


export { createUser, getAllUsers, getUserByUUID, updateUserByUUID, deleteUserByUUID, forceDeleteUserByUUID };
