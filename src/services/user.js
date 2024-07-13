import db from '../models/index.js'; 
import bcrypt from 'bcrypt';
const { User } = db;

const createUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw new Error('Error creating the user: ' + error.message);
    }
};

const validateUserCredentials = async (username, password) => {
    try {
        const user = await User.findOne({
            where: { username }
        });
        if (!user) {
            return null;
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return null;
        }
        return user;
    } catch (error) {
        throw new Error('Authentication failed: ' + error.message);
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

const verifyNumber = async (mobile) => {
    try {        
        const user = await User.findOne({
            where: { mobile },
        });

        if (!user) {
            return false;
        }

        user.isMobileVerified = true;
        await user.save();
        return true;
    } catch (error) {
        throw new Error('Error while verifying otp: ' + error);
    }

}

const updateUser = async (userData, existingUser) => {
    try {
        Object.assign(existingUser, userData);
        await existingUser.save();
        return existingUser;
    } catch (error) {
        throw new Error('Error while updating user: ' + error.message);
    }
}

const deleteUser = async (existingUser) => {
    try {
        await existingUser.destroy();
        return existingUser;
    } catch (error) {
        throw new Error('Error while deleting user: ' + error.message);
    }
}

const forceDeleteUser = async (existingUser) => {
    try {
        await existingUser.destroy({ force: true });
        return existingUser;
    } catch (error) {
        throw new Error('Error while deleting user: ' + error.message);
    }
}

const findUserByMobile = async (mobile) => {
    try {
        const user = await User.findOne({
            where: { mobile }
        });
        return user;
    } catch (error) {
        throw new Error('Error finding user by mobile: ' + error.message);
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: { email }
        });
        return user;
    } catch (error) {
        throw new Error('Error finding user by email: ' + error.message);
    }
};

const findUserByUsername = async (username) => {
    try {
        const user = await User.findOne({
            where: { username }
        });
        return user;
    } catch (error) {
        throw new Error('Error finding user by username: ' + error.message);
    }
};

export { createUser, validateUserCredentials, getAllUsers, getUserByUUID, updateUser, deleteUser, forceDeleteUser, verifyNumber, findUserByMobile, findUserByEmail, findUserByUsername };
