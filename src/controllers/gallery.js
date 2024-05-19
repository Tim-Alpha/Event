import multer from 'multer';
import { response } from '../services/utils.js';
import * as galleryService from '../services/gallery.js';

// Set up multer storage
// const storage = multer.memoryStorage();

// Set up multer storage to store files on disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../uploads/'); // Specify the directory where files will be saved
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate unique filename
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Use original filename with a unique prefix
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG, JPG and JPEG files are allowed'));
        }
    }
}).single('file');

const createGallery = async (req, res) => {
    try {
        let viewer = req.user;
    
        if (!viewer) {
            return res.status(400).json(response("failed", "user not logged in"));
        }

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json(response("failed", err.message));
            }

            const file = req.file;
            const fileType = file.mimetype;
            if (!file) {
                return res.json(response("failed", "Missing file!!"));
            }
            if (!fileType) {
                return res.json(response("failed", "Missing fileType!!"));
            }

            const createdGallery = await galleryService.createGallery(file, fileType);
            res.json(response("success", "Gallery created successfully", "gallery", createdGallery));
        });
    } catch (error) {
        res.status(500).json(response("error", error.message));
    }
}

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
