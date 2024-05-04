import * as userService from '../services/user.js';
import response from '../services/utils.js';

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        if (userData.mobile.length !== 10 && !isNaN(userData.mobile)) {
            res.status(400).json({
                "status": "failed",
                "message": "Invalid mobile number"
            });
        }
        const user = await userService.createUser(userData);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users =await userService.getAllUsers();
        
        res.status(201).json(response("success", "User created successfully", "users", users));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserByUUID = async (req, res) => {
    const uuid = req.params.uuid;

    if (!uuid) res.status(400).json({status: "failed", message: "Invalid uuid"});

    try {
        const user = await userService.getUserByUUID(uuid);
        res.status(200).json({
            status: "success",
            message: "User fetched successfully",
            user: user
        });
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: "Something went wrong! " + error
        });
    }
}

const updateUserByUUID = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const userData = req.body;

        const user = await userService.updateUserByUUID(userData, uuid);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}

const deleteUserByUUID = async (req, res) => {
    try {
        const uuid = req.params.uuid;

        const user = await userService.deleteUserByUUID(uuid);

        res.status(201).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const forceDeleteUserByUUID = async (req, res) => {
    try {
        const uuid = req.params.uuid;

        const user = await userService.forceDeleteUserByUUID(uuid);

        res.status(201).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createUser, getAllUsers, getUserByUUID, updateUserByUUID, deleteUserByUUID, forceDeleteUserByUUID };
