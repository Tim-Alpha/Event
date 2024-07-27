import db from '../models/index.js';
const { Review } = db;

const createReview = async (reviewData) => {
    try {
        const review = await Review.create(reviewData);
        return review;
    } catch (error) {
        throw new Error("Failed to create review: " + error);
    }
};

const getAllReviews = async (uuid) => {
    try {
        const review = await Review.findAll({
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            },
            {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return review;
    } catch (error) {
        throw new Error("Failed to retrieve review: " + error);
    }
};

const getReviewByUUID = async (uuid) => {
    try {
        const review = await Review.findOne({
            where: { uuid },
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            },
            {
                model: db.Venue,
                as: 'venue',
                foreignKey: 'venueId'
            }]
        });
        return review;
    } catch (error) {
        throw new Error("Failed to retrieve review: " + error);
    }
};

const updateReview = async (review, reviewData) => {
    try {
        Object.assign(review, reviewData);
        await review.save();
        return review;
    } catch (error) {
        throw new Error("Failed to update review: " + error);
    }
};

const deleteReview = async (review) => {
    try {
        const deletedCount = await review.destroy();
        if (deletedCount === 0) {
            throw new Error("Review not found");
        }
    } catch (error) {
        throw new Error("Failed to delete review: " + error);
    }
};

const getAllReviewsByVenueID = async (venueId, page, pageSize) => {
    try {
        const pageInt = parseInt(page, 10);
        const pageSizeInt = parseInt(pageSize, 10);
        const offset = (pageInt - 1) * pageSizeInt;

        const { count, rows } = await Review.findAndCountAll({
            where: { venueId },
            include: [{
                model: db.User,
                as: 'user',
                foreignKey: 'userId'
            }],
            limit: pageSizeInt,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });
        const maxPageSize = Math.ceil(count / pageSizeInt);
        return {
            reviews: rows,
            page: pageInt,
            maxPageSize: maxPageSize,
            pageSize: pageSizeInt
        };
    } catch (error) {
        throw new Error("Failed to retrieve reviews: " + error);
    }
};

export { createReview, getReviewByUUID, getAllReviews, updateReview, deleteReview, getAllReviewsByVenueID };
