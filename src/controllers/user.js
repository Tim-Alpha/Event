import * as userService from '../services/user.js';
import * as middleware from '../middlewares/authentication.js';
import * as event from '../event/sendOtp.js';
import { response, generateOTP, verifyOTP } from '../services/utils.js';
import db from '../models/index.js';
import { sendOtpEmail } from '../event/sendOtpEmail.js';
import uploadFileOnFirebase from "../services/profileHelper.js";
import multer from 'multer';
import sharp from 'sharp';
import exif from 'exif-parser';
import fs from 'fs';
import sizeOf from 'image-size';
import path from 'path';
const { sequelize } = db;

const restrictedUsernames = ["event", "admin", "eclipse", "guest", "test", "owner"];

const profileURLs = [
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-52-42_1_profile.jpg?alt=media&token=bcf661e1-6be0-4f45-97dc-36000daf5a84",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-54-24_1_profile.jpg?alt=media&token=8f00c61a-bdde-4f12-bccf-e27efacbd7c0",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-55-00_1_profile.jpg?alt=media&token=cd94c8a2-a69d-413b-9533-21dbf924aafa",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-55-45_1_profile.jpg?alt=media&token=3f06fd95-4af1-48ca-9e54-83af6ba69b7f",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-56-34_1_profile.jpg?alt=media&token=66054fd9-6df1-4ea2-ae13-a56b0405ea45",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-57-11_1_profile.jpg?alt=media&token=df1fec5b-2beb-4094-a72b-fa1e6074f616",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-57-51_1_profile.jpg?alt=media&token=185dbcaf-66d6-4f6c-9033-3a02f5846b75",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-58-35_1_profile.jpg?alt=media&token=b1f17be9-9273-4d23-adef-72681afa3317",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-59-09_1_profile.jpg?alt=media&token=4b41b719-d3c5-41d1-8191-21b51170a833",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_16-59-47_1_profile.jpg?alt=media&token=4f0a4588-093b-4fa0-9f44-7b5a5b06961b",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_17-01-07_1_profile.jpg?alt=media&token=b8f7b951-5d92-4a9a-9177-e084052dc91f",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_17-02-48_1_profile.jpg?alt=media&token=d6562b01-52e8-427c-9ee2-a4f8180bd80b",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_17-08-25_1_profile.jpg?alt=media&token=78a7ed78-2267-4a7a-945c-d99f198c04bf",
    "https://firebasestorage.googleapis.com/v0/b/eventeclipse-54084.appspot.com/o/profiles%2F2024-08-11_17-09-16_1_profile.jpg?alt=media&token=f1cd9ddc-206d-4e88-94b3-6069eea1c21b",
];

const createUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userData = req.body;

        // Generate a random number between 0 and 13
        const randomNum = Math.floor(Math.random() * profileURLs.length);
        userData.profileUrl = profileURLs[randomNum];

        if (userData.role === "ADMIN") {
            return res.status(400).json(response("failed", "Invalid role"));
        }

        if (userData.mobile.length !== 10 || isNaN(userData.mobile)) {
            return res.status(400).json(response("failed", "Invalid mobile number"));
        }

        if (restrictedUsernames.includes(userData.username.toLowerCase())) {
            return res.status(400).json(response("failed", "Username not allowed"));
        }

        const mobileExists = await userService.findUserByMobile(userData.mobile);
        if (mobileExists) {
            return res.status(400).json(response("failed", "Mobile number already exists"));
        }

        const emailExists = await userService.findUserByEmail(userData.email);
        if (emailExists) {
            return res.status(400).json(response("failed", "Email already exists"));
        }

        const usernameExists = await userService.findUserByUsername(userData.username);
        if (usernameExists) {
            return res.status(400).json(response("failed", "Username already exists"));
        }

        const user = await userService.createUser(userData, transaction);

        let otp = generateOTP(userData.mobile);
        const smsStatus = await event.sendOtp(userData.mobile, otp);
        const emailStatus = await sendOtpEmail(userData.email, otp);

        // if (!emailStatus || smsStatus !== 200 ) {
        //     await transaction.rollback();
        //     return res.status(500).json(response("error", "Otp sending failed, please try again"));
        // }

        await transaction.commit();
        return res.status(201).json(response("success", "Account created successful!", "data", { message: "Otp sent successfully", user }));
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json(response("error", error.message));
    }
};

const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.validateUserCredentials(username, password);
        if (!user) {
            return res.status(401).json(response("failed", "Invalid credentials"));
        }

        if (user.isEmailVerified === false && user.isMobileVerified === false) {
            return res.status(401).json(response("failed", "Mobile number not verified: please verify!"));
        }

        const token = await middleware.generateToken(user);

        const result = {
            token: token,
            user: user
        }
        res.status(200).json(response("success", "Login successful", "data", result));
    } catch (error) {
        res.status(500).json(response("error", "Login failed"));
    }
};

const sendOtp = async (req, res) => {
    try {
        let { number, email } = req.body
        if (!number) {
            return res.status(400).json(response("failed", "Invalid mobile number parameter"));
        }
        let otp = generateOTP(number);
        const status = await event.sendOtp(number, otp);
        if (email) {
            const emailStatus = await sendOtpEmail(email, otp);
            return res.status(200).json(response("success", `Otp to ${number} & ${email} sent successfully`));
        }
        else {
            return res.status(200).json(response("success", `Otp to ${number} sent successfully`));
        }

        // if (status !== 200) {
        //     return res.status(500).json(response("error", "Otp sending failed, please try again"));
        // }

    } catch (error) {
        res.status(500).json(response("error", "otp sending failed"));
    }
}

const verifyNumber = async (req, res) => {
    try {
        const data = req.body
        const status = verifyOTP(data.number, data.otp);

        if (!status) {
            return res.status(400).json(response("error", "Invalid otp try again!"));
        }

        const isSuccess = userService.verifyNumber(data.number);

        if (!isSuccess) {
            return res.status(404).json(response("error", "Account with mobile not found"));
        }

        return res.status(200).json(response("success", "Mobile / email verified successfully"));
    } catch (error) {
        return res.status(500).json(response("error", "ERROR: " + error));
    }
}

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const users = await userService.getAllUsers(page, pageSize);
        return res.status(200).json(response("success", "Users retrieved successfully", "users", users));
    } catch (error) {
        return res.status(500).json(response("error", error.message));
    }
}

const getUserByUUID = async (req, res) => {
    const uuid = req.params.uuid;

    if (!uuid) return res.status(400).json(response("failed", "Invalid uuid"));

    try {
        const user = await userService.getUserByUUID(uuid);
        res.status(200).json(response("success", "User fetched successfully", "user", user));
    } catch (error) {
        res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

const getUserByToken = async (req, res) => {
    try {
        const userData = req.user;
        const user = await userService.getUserByUUID(userData.uuid);
        res.status(200).json(response("success", "User fetched successfully", "user", user));
    } catch (error) {
        res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

const updateUser = async (req, res) => {
    try {
        const userData = req.body;
        if (!req.user) {
            return res.status(404).json(response("error", "User not logged in"));
        }
        const user = await userService.updateUser(userData, req.user);

        res.status(201).json(response("success", "User updated successfully", "user", user));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

const deleteUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json(response("error", "User not logged in"));
        }

        await userService.deleteUser(req.user);

        res.status(201).json(response("success", "User deleted successfully"));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

const forceDeleteUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json(response("error", "User not logged in"));
        }

        await userService.forceDeleteUser(req.user);

        res.status(201).json(response("success", "User deleted successfully"));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("File upload only supports the following types - JPEG, JPG, PNG, and WEBP"));
    }
}).single('file');

const updateProfile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json(response("failed", err.message));
        }

        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json(response("error", "User not logged in"));
            }

            if (!req.file) {
                return res.status(400).json(response("failed", "No file uploaded"));
            }

            // Determine the image type and process it accordingly
            const dimensions = sizeOf(req.file.buffer);
            const format = dimensions.type;

            let jpgBuffer;
            try {
                if (format === 'webp' || format === 'png' || format === 'jpeg' || format === 'jpg') {
                    jpgBuffer = await sharp(req.file.buffer)
                        .jpeg({ quality: 90 })
                        .toBuffer();
                } else {
                    return res.status(400).json(response("error", "Unsupported image format"));
                }
            } catch (sharpError) {
                return res.status(400).json(response("error", "Error processing the image. Ensure it's a valid WebP, PNG, or JPEG image."));
            }

            // Extract metadata using exif-parser if applicable (EXIF might not be available in WebP)
            let metadata;
            try {
                const parser = exif.create(req.file.buffer);
                const result = parser.parse();
                metadata = result.tags;
            } catch (exifError) {
                console.log("Metadata extraction failed, possibly because it's a WebP image");
                metadata = {};  // Or handle as necessary
            }


            // Upload to Firebase
            const fileName = `${user.id}_profile.jpg`; // Create a unique filename
            const fileURL = await uploadFileOnFirebase(fileName, jpgBuffer, metadata);

            if (!fileURL) {
                return res.status(500).json(response("error", "File upload failed"));
            }

            // Update user's profile with the new image URL (assuming a function to do this)
            const updatedUser = await userService.updateUser({ profileUrl: fileURL }, user);

            // Send back the response with the download URL
            return res.status(200).json(response("success", "Profile updated successfully", "user", updatedUser));
        } catch (error) {
            console.log("ERROR: " + error.toString());
            return res.status(500).json(response("error", error.message));
        }
    });
};

export { createUser, userLogin, verifyNumber, sendOtp, getAllUsers, getUserByUUID, updateUser, deleteUser, forceDeleteUser, getUserByToken, updateProfile };
