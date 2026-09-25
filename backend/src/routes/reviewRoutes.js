const express = require("express");

const {
  createReview,
  getPublicReviews,
  getReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/", createReview);
router.get("/public", getPublicReviews);

// Admin routes
router.get("/", authMiddleware, getReviews);
router.patch(
  "/:id/status",
  authMiddleware,
  updateReviewStatus
);
router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

module.exports = router;