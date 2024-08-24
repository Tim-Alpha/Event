import multer from 'multer';
import { response } from '../services/utils.js';
import * as galleryService from '../services/gallery.js';
import * as venueService from '../services/venue.js';
import uploadFileOnFirebase from "../services/profileHelper.js";
import sharp from 'sharp';
import exif from 'exif-parser';
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

const createGallery = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json(response("failed", err.message));
        }

        try {
            const viewer = req.user;
            const { uuid: venueUUID } = req.params;

            if (!viewer) {
                return res.status(401).json(response("failed", "User not logged in"));
            }

            if (!venueUUID) {
                return res.status(400).json(response("failed", "venueUUID is missing"));
            }

            const venue = await venueService.getVenueByUUID(venueUUID);
            if (!venue) {
                return res.status(404).json(response("failed", "Venue not found"));
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json(response("failed", "Missing file"));
            }

            // Determine the image type and process it accordingly
            const dimensions = sizeOf(file.buffer);
            const format = dimensions.type;

            let jpgBuffer;
            try {
                if (format === 'webp' || format === 'png' || format === 'jpeg' || format === 'jpg') {
                    jpgBuffer = await sharp(file.buffer)
                        .jpeg({ quality: 90 })
                        .toBuffer();
                } else {
                    return res.status(400).json(response("error", "Unsupported image format"));
                }
            } catch (sharpError) {
                return res.status(400).json(response("error", "Error processing the image. Ensure it's a valid WebP, PNG, or JPEG image."));
            }

            // Extract metadata using exif-parser if applicable (EXIF might not be available in WebP)
            let metadata = {};
            try {
                const parser = exif.create(file.buffer);
                const result = parser.parse();
                metadata = result.tags;
            } catch (exifError) {
                console.log("Metadata extraction failed, possibly because it's a WebP image");
            }

            // Generate file name and upload to Firebase
            const date = new Date();
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            const time = date.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-'); // HH-MM-SS format

            const cleanFileName = `${formattedDate}_${time}_${venueUUID}_gallery.jpg`;
            const fileName = `galleries/${cleanFileName}`;

            const fileURL = await uploadFileOnFirebase(fileName, jpgBuffer, metadata);

            if (!fileURL) {
                return res.status(500).json(response("error", "File upload failed"));
            }
            const createdGallery = await galleryService.createGallery(fileURL, 'jpg', venueUUID);

            res.status(201).json(response("success", "Gallery created successfully", "gallery", createdGallery));
        } catch (error) {
            res.status(500).json(response("error", error.message));
        }
    });
};


const getAllGallery = async (req, res) => {
    try {
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }
        const allGalleries = await galleryService.getAllGalleries();
        res.json(response("success", "All galleries retrieved successfully", "galleries", allGalleries));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

const getGalleryByUUID = async (req, res) => {
    try {
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }
        const { uuid } = req.params;
        if (!uuid) {
            return res.json(response("failed", "Missing UUID parameter"));
        }
        const gallery = await galleryService.getGalleryByUUID(uuid);
        res.json(response("success", "Gallery retrieved successfully", "gallery", gallery));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

const updateGallery = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { file } = req.body;
        let viewer = req.user;
        const fileType = file.mimetype;
        if (!fileType) {
            return res.json(response("failed", "Missing fileType!!"));
        }
        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }
        if (!uuid) {
            return res.json(response("failed", "Missing UUID parameter"));
        }
        if (!file) {
            return res.json(response("failed", "Missing file!!"));
        }
        const updatedGallery = await galleryService.updateGallery(uuid, file, fileType);
        res.json(response("success", "Gallery updated successfully", "gallery", updatedGallery));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

const deleteGallery = async (req, res) => {
    try {
        const { uuid } = req.params;
        let viewer = req.user;

        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }
        if (!uuid) {
            return res.json(response("failed", "Missing UUID parameter"));
        }
        await galleryService.deleteGallery(uuid);
        res.json(response("success", "Gallery deleted successfully"));
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

export { createGallery, getAllGallery, getGalleryByUUID, updateGallery, deleteGallery };
