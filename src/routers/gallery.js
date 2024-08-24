import express from 'express';
import * as galleryController from '../controllers/gallery.js';
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/gallery/:uuid/create', middleware.verifyToken, galleryController.createGallery);
router.get('/gallery/get_all', middleware.verifyToken, galleryController.getAllGallery);
router.get('/gallery/get_by_uuid', middleware.verifyToken, galleryController.getGalleryByUUID);
router.put('/gallery/update', middleware.verifyToken, galleryController.updateGallery);
router.delete('/gallery/delete', middleware.verifyToken, galleryController.deleteGallery);

export default router;