import * as userService from '../services/user.js';
import * as middleware from '../middlewares/authentication.js';
import * as event from '../event/sendOtp.js';
import { response, generateOTP, verifyOTP } from '../services/utils.js';

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        if (userData.mobile.length !== 10 && !isNaN(userData.mobile)) {
            return res.status(400).json(response("failed", "Invalid mobile number", null, null));
        }
        const user = await userService.createUser(userData);

        let otp = generateOTP(userData.mobile);
        const status  = await event.sendOtp(userData.mobile, otp);
        
        if (status !== 200) {
            return res.status(500).json(response("error", "Otp sending failed, please try again", null, null));
        }

        res.status(201).json(response("success", "Account created successful!", "data", { message: "Otp sent successfully", user }));
    } catch (error) {
        res.status(500).json(response("error", error.message, null, null));
    }
};

const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.validateUserCredentials(username, password);
        if (!user) {
            return res.status(401).json(response("failed", "Invalid credentials", null, null));
        }
        
        if(user.isMobileVerified === false) {
            return res.status(401).json(response("failed", "Mobile number not verified: please verify!", null, null));
        }

        const token = await middleware.generateToken(user);
        res.status(200).json(response("success", "Login successful", "token", token));
    } catch (error) {
        res.status(500).json(response("error", "Login failed", null, null));
    }
};

const sendOtp = async (req, res) => {
    try{
        let mobileNumber = req.body.number
        if (!mobileNumber) {
            return res.status(400).json(response("failed", "Invalid mobile number parameter", null, null));
        }
        let otp = generateOTP(mobileNumber);
        const status  = await event.sendOtp(mobileNumber, otp);

        if (status !== 200) {
            return res.status(500).json(response("error", "Otp sending failed, please try again", null, null));
        }

        res.status(200).json(response("success", `Otp to ${mobileNumber} sent successfully`, null, null));
    } catch(error) {
        res.status(500).json(response("error", "otp sending failed", null, null));
    }
}

const verifyNumber = async (req, res) => {
    try {
        const data = req.body
        const status = verifyOTP(data.number, data.otp)

        if (!status) {
            return res.status(400).json(response("error", "Invalid otp try again!", null, null));
        }

        res.status(200).json(response("success", "Mobile number verified successfully", null, null));
    } catch (error) {
        res.status(500).json(response("error", "Login failed", null, null));
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        
        res.status(201).json(response("success", "User created successfully", "users", users));
    } catch (error) {
        res.status(500).json(response("error", error.message, null, null));
    }
}

const getUserByUUID = async (req, res) => {
    const uuid = req.params.uuid;

    if (!uuid) return res.status(400).json(response("failed", "Invalid uuid", null, null));

    try {
        const user = await userService.getUserByUUID(uuid);
        res.status(200).json(response("success", "User fetched successfully", "user", user));
    } catch (error) {
        res.status(500).json(response("error", "Something went wrong! " + error, null, null));
    }
}

const updateUser = async (req, res) => {
    try {
        const userData = req.body;
        if (!req.user) {
            return res.status(404).json(response("error", "User not logged in", null, null));
        }
        const user = await userService.updateUser(userData, req.user);

        res.status(201).json(response("success", "User updated successfully", "user", user));
    } catch (error) {
        res.status(500).json(response("error", error.message, null, null));
    }
}

const deleteUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json(response("error", "User not logged in", null, null));
        }

        await userService.deleteUser(req.user);

        res.status(201).json(response("success", "User deleted successfully", null, null));
    } catch (error) {
        res.status(500).json(response("error", error.message, null, null));
    }
}

const forceDeleteUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json(response("error", "User not logged in", null, null));
        }

        await userService.forceDeleteUser(req.user);

        res.status(201).json(response("success", "User deleted successfully", null, null));
    } catch (error) {
        res.status(500).json(response("error", error.message, null, null));
    }
}

export { createUser, userLogin, verifyNumber, sendOtp, getAllUsers, getUserByUUID, updateUser, deleteUser, forceDeleteUser };
