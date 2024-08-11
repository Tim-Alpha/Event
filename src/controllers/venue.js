import * as venueService from '../services/venue.js';
import { response } from '../services/utils.js';
import uploadFileOnFirebase from "../services/profileHelper.js";
import multer from 'multer';
import sharp from 'sharp';
import exif from 'exif-parser';
import fs from 'fs';
import sizeOf from 'image-size';
import path from 'path';

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

const createVenue = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json(response("failed", err.message));
        }

        try {
            const venueData = req.body;
            const user = req.user;

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User not logged in"
                });
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
                metadata = {};
            }


            // Upload to Firebase
            // Get a formatted date string

            let fileName = `${user.id}_venue.jpg`;
            const date = new Date();
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            const time = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // HH-MM-SS format

            // Combine the date and time with the file name
            const cleanFileName = `${formattedDate}_${time}_${fileName}`;
            fileName = `venues/${cleanFileName}`;

            const fileURL = await uploadFileOnFirebase(fileName, jpgBuffer, metadata);

            if (!fileURL) {
                return res.status(500).json(response("error", "File upload failed"));
            }

            // Add the image URL to venue data
            venueData.imageUrl = fileURL;

            // Create the venue with the image URL included in venueData
            const venue = await venueService.createVenue(venueData, user);

            res.status(201).json({
                status: "success",
                message: "Venue created successfully",
                venue: venue
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong! " + error
            });
        }
    });
};

const getAllVenues = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const venueData = await venueService.getAllVenues(page, pageSize);
        res.status(200).json({
            status: "success",
            message: "Venues fetched successfully",
            venues: venueData
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong! " + error
        });
    }
}

const getVenueByUUID = async (req, res) => {
    try {
        let { uuid } = req.query;

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter"));
        }

        const venue = await venueService.getVenueByUUID(uuid);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        return res.status(200).json(response("success", "Venue fetched successfully", "venue", venue));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

const updateVenueByUUID = async (req, res) => {
    try {
        let uuid = req.params.uuid;
        let venueData = req.body;
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter"));
        }

        let venue = await venueService.getVenueByUUID(uuid, viewer);

        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        if (!venue.dataValues.owner || viewer.id !== venue.dataValues.owner.id) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        venue = await venueService.updateVenueByUUID(venueData, venue);

        return res.status(200).json(response("success", "Venue updated successfully", "venue", venue));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

const deleteVenueByUUID = async (req, res) => {
    try {
        let { uuid } = req.query;
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }

        if (!uuid) {
            return res.status(400).json(response("failed", "missing uuid parameter"));
        }

        let venue = await venueService.getVenueByUUID(uuid, viewer);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        if (!venue.dataValues.owner || viewer.id !== venue.dataValues.owner.id) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        const deletedVenue = await venueService.deleteVenueByUUID(venue);
        if (!deletedVenue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        return res.status(200).json(response("success", "Venue deleted successfully"));
    } catch (error) {
        return res.status(500).json(response("error", "Something went wrong! " + error));
    }
}

export { createVenue, getAllVenues, getVenueByUUID, updateVenueByUUID, deleteVenueByUUID };
