const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  replyToEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public customer enquiry submission
router.post("/", createEnquiry);

// Protected admin routes
router.get("/", authMiddleware, getEnquiries);
router.get("/:id", authMiddleware, getEnquiryById);
router.patch("/:id/status", authMiddleware, updateEnquiryStatus);
router.post("/:id/reply", authMiddleware, replyToEnquiry);
router.delete("/:id", authMiddleware, deleteEnquiry);


module.exports = router;