import express from 'express';
import * as venueController from '../controllers/venue.js';

const router = express.Router();

router.post('/venues', venueController.createVenue);
router.get('/venues', venueController.getAllVenues);

export default router;