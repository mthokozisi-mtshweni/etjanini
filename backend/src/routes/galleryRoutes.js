const express = require("express");

const {
  createGalleryImage,
  getGalleryImages,
  getPublicGallery,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get(
  "/public",
  getPublicGallery
);

// Admin
router.get(
  "/",
  authMiddleware,
  getGalleryImages
);

router.get(
  "/:id",
  authMiddleware,
  getGalleryImageById
);

router.post(
  "/",
  authMiddleware,
  createGalleryImage
);

router.patch(
  "/:id",
  authMiddleware,
  updateGalleryImage
);

router.delete(
  "/:id",
  authMiddleware,
  deleteGalleryImage
);

module.exports = router;