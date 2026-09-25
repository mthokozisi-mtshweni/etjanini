const prisma = require("../config/prisma");

const VALID_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

const validateRating = (rating) => {
  const value = Number(rating);

  return Number.isInteger(value) &&
    value >= 1 &&
    value <= 5;
};

const cleanString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

// Create a public review
const createReview = async (req, res) => {
  try {
    const name = cleanString(req.body.name);
    const comment = cleanString(req.body.comment);
    const rating = Number(req.body.rating);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters.",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be 100 characters or less.",
      });
    }

    if (!validateRating(rating)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Review must be at least 10 characters.",
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review must be 1000 characters or less.",
      });
    }

    const review = await prisma.review.create({
      data: {
        name,
        rating,
        comment,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for your review. It has been submitted for approval.",
      review: {
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
};

// Get approved reviews for the public website
const getPublicReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get public reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

// Get all reviews for admin
const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
};

// Update review status
const updateReviewStatus = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    const status = cleanString(
      req.body.status
    ).toUpperCase();

    if (!Number.isInteger(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status.",
      });
    }

    const existingReview =
      await prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const review =
      await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          status,
        },
      });

    return res.json({
      success: true,
      message: `Review ${status.toLowerCase()}.`,
      review,
    });
  } catch (error) {
    console.error(
      "Update review status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update review.",
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    if (!Number.isInteger(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const existingReview =
      await prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete review error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete review.",
    });
  }
};

module.exports = {
  createReview,
  getPublicReviews,
  getReviews,
  updateReviewStatus,
  deleteReview,
};