const express = require("express");

const {
  getMenu,
  getMenuCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

router.get("/", getMenu);

/*
|--------------------------------------------------------------------------
| ADMIN - CATEGORIES
|--------------------------------------------------------------------------
*/

router.get(
  "/categories",
  authMiddleware,
  getMenuCategories
);

router.post(
  "/categories",
  authMiddleware,
  createCategory
);

router.patch(
  "/categories/:id",
  authMiddleware,
  updateCategory
);

router.delete(
  "/categories/:id",
  authMiddleware,
  deleteCategory
);

/*
|--------------------------------------------------------------------------
| ADMIN - ITEMS
|--------------------------------------------------------------------------
*/

router.post(
  "/items",
  authMiddleware,
  createMenuItem
);

router.patch(
  "/items/:id",
  authMiddleware,
  updateMenuItem
);

router.delete(
  "/items/:id",
  authMiddleware,
  deleteMenuItem
);

module.exports = router;