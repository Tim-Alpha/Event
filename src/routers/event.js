import express from 'express';
import * as eventController from '../controllers/event.js';
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/event/create', middleware.verifyToken, eventController.createEvent);
router.get('/event/get_all', eventController.getAllEvents);
router.get('/event/get_by_uuid', eventController.getEventByUUID);
router.get('/event/venue/:venueUUID', eventController.getEventsByVenueUUID);
router.put('/event/update/:uuid', middleware.verifyToken, eventController.updateEventByUUID);
router.delete('/event/delete/:uuid', middleware.verifyToken, eventController.deleteEventByUUID);

export default router;
