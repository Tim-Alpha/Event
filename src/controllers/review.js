import * as reviewService from '../services/review.js';
import * as venueService from '../services/venue.js';
import { response } from '../services/utils.js';

const createReview = async (req, res) => {
    try {
        const { content, rating, venueUUID } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json(response("error", "User not logged in"));
        }
        if (!content || !rating || !venueUUID) {
            return res.status(400).json(response("failed", "Missing required fields"));
        }

        const venue = await venueService.getVenueByUUID(venueUUID);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        const reviewData = {
            content,
            rating,
            userId: user.dataValues.id,
            venueId: venue.dataValues.id
        };

        const result = await reviewService.createReview(reviewData);
        res.status(201).json(response("success", "Review created successfully", "review", result));
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));
    }
};

const getReviewByUUID = async (req, res) => {
    try {
        const { uuid } = req.query;
        if (!uuid) {
            return res.status(400).json(response("failed", "Invalid parameter uuid"));
        }
        const result = await reviewService.getReviewByUUID(uuid);
        res.status(200).json(response("success", "Review fetched successfully", "review", result));
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));
    }
};

const updateReviewByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { content, rating } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json(response("error", "User not logged in"));
        }
        if (!uuid) {
            return res.status(400).json(response("failed", "Missing UUID parameter"));
        }
        let review = await reviewService.getReviewByUUID(uuid);
        if (!review) {
            return res.status(404).json(response("error", "Review not found"));
        }
        if (user.dataValues.id !== review.dataValues.userId) {
            return res.status(401).json(response("error", "Unauthorized"));
        }

        review = await reviewService.updateReview(review, req.body);
        res.status(200).json(response("success", "Review updated successfully", "review", review));
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));
    }
};

const deleteReviewByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json(response("error", "User not logged in"));
        }
        if (!uuid) {
            return res.status(400).json(response("failed", "Missing UUID parameter"));
        }
        const review = await reviewService.getReviewByUUID(uuid);
        if (!review) {
            return res.status(404).json(response("error", "Review not found"));
        }
        if (user.dataValues.id !== review.dataValues.userId) {
            return res.status(401).json(response("error", "Unauthorized"));
        }
        await reviewService.deleteReview(review);
        res.status(200).json(response("success", "Review deleted successfully"));
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));
    }
};

const getAllReviewsByVenueID = async (req, res) => {
    try {
        const { uuid, page = 1, pageSize = 10 } = req.query;
        if (!uuid) {
            return res.status(400).json(response("failed", "Missing uuid parameter"));
        }

        const venue = await venueService.getVenueByUUID(uuid);
        if (!venue) {
            return res.status(404).json(response("error", "Venue not found"));
        }

        const result = await reviewService.getAllReviewsByVenueID(venue.dataValues.id, page, pageSize);
        res.status(200).json(response("success", "Reviews fetched successfully", "reviews", result.reviews, result.page, result.maxPageSize, result.pageSize));
    } catch (error) {
        res.status(500).json(response("error", "ERROR: " + error));
    }
};

export { createReview, getReviewByUUID, updateReviewByUUID, deleteReviewByUUID, getAllReviewsByVenueID };
