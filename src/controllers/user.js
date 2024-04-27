import * as userService from '../services/user.js';

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        if (userData.mobile.length !== 10 && !isNaN(userData.mobile)) {
            res.status(400).json({
                "status": "failed",
                "message": "Invalid mobile number"
            });
        }
        const user = await userService.createUser(req.body);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users =await userService.getAllUsers();
        
        res.status(200).json({
            "status": "success",
            "message": "Data fetched successfully",
            "users": users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export { createUser, getAllUsers };
