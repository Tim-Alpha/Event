// userService.js
import db from '../models/index.js'; 

const createUser = async (userData) => {
    const { User } = db;
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw new Error('Error creating the user: ' + error.message);
    }
};

export { createUser };
