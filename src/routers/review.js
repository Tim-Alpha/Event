import express from 'express';
import * as reviewController from "../controllers/review.js";
import * as middleware from '../middlewares/authentication.js';

const router = express.Router();

router.post('/review/create', middleware.verifyToken, reviewController.createReview);
router.get('/review/get_by_uuid', reviewController.getReviewByUUID);
router.get('/review/get-all', reviewController.getAllReview);
router.get('/review/get_by_venue_uuid', reviewController.getAllReviewsByVenueID);
router.put('/review/update/:uuid', middleware.verifyToken, reviewController.updateReviewByUUID);
router.delete('/review/delete/:uuid', middleware.verifyToken, reviewController.deleteReviewByUUID);

export default router;