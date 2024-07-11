import express from 'express';
import * as venueController from '../controllers/venue.js';
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/venues', middleware.verifyToken, venueController.createVenue);
router.get('/venues/get_all', venueController.getAllVenues);
router.get('/venue/get_by_uuid', venueController.getVenueByUUID);
router.put('/venue/update/:uuid', middleware.verifyToken, venueController.updateVenueByUUID);
router.delete('/venue/delete', middleware.verifyToken, venueController.deleteVenueByUUID);

export default router;