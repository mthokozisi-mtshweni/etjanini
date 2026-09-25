const express = require("express");

const {
  getPublicSettings,
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/public", getPublicSettings);

router.get("/", authMiddleware, getSettings);

router.patch("/", authMiddleware, updateSettings);

module.exports = router;