const express = require("express");

const {
  createEvent,
  getEvents,
  getPublicEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/public", getPublicEvents);

// Admin
router.get("/", authMiddleware, getEvents);

router.get(
  "/:id",
  authMiddleware,
  getEventById
);

router.post(
  "/",
  authMiddleware,
  createEvent
);

router.patch(
  "/:id",
  authMiddleware,
  updateEvent
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEvent
);

module.exports = router;