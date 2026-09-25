const prisma = require("../config/prisma");

/*
|--------------------------------------------------------------------------
| PUBLIC MENU
|--------------------------------------------------------------------------
*/

const getMenu = async (req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        items: {
          where: {
            isAvailable: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get menu error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load menu.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - CATEGORIES
|--------------------------------------------------------------------------
*/

const getMenuCategories = async (req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
        items: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get menu categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load menu categories.",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      sortOrder,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const cleanName = name.trim();

    const cleanSlug =
      slug?.trim().toLowerCase() ||
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const category = await prisma.menuCategory.create({
      data: {
        name: cleanName,
        slug: cleanSlug,
        sortOrder: Number(sortOrder) || 0,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Menu category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Create menu category error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message:
          "A category with this name or slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create menu category.",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const {
      name,
      slug,
      sortOrder,
      isActive,
    } = req.body;

    const category = await prisma.menuCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(slug !== undefined && {
          slug: slug.trim().toLowerCase(),
        }),

        ...(sortOrder !== undefined && {
          sortOrder: Number(sortOrder),
        }),

        ...(isActive !== undefined && {
          isActive: Boolean(isActive),
        }),
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: "Menu category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update menu category error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Menu category not found.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message:
          "A category with this name or slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update menu category.",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    await prisma.menuCategory.delete({
      where: {
        id: categoryId,
      },
    });

    return res.json({
      success: true,
      message: "Menu category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete menu category error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Menu category not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete menu category.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - MENU ITEMS
|--------------------------------------------------------------------------
*/

const createMenuItem = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      description,
      price,
      imageUrl,
      featured,
      isAvailable,
      sortOrder,
    } = req.body;

    if (!categoryId || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Category, item name and price are required.",
      });
    }

    const numericCategoryId = Number(categoryId);
    const numericPrice = Number(price);

    if (
      !Number.isInteger(numericCategoryId) ||
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category or price.",
      });
    }

    const category =
      await prisma.menuCategory.findUnique({
        where: {
          id: numericCategoryId,
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Menu category not found.",
      });
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId: numericCategoryId,
        name: name.trim(),
        description: description?.trim() || null,
        price: numericPrice,
        imageUrl: imageUrl?.trim() || null,
        featured: Boolean(featured),
        isAvailable:
          isAvailable === undefined
            ? true
            : Boolean(isAvailable),
        sortOrder: Number(sortOrder) || 0,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully.",
      item,
    });
  } catch (error) {
    console.error("Create menu item error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create menu item.",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID.",
      });
    }

    const {
      categoryId,
      name,
      description,
      price,
      imageUrl,
      featured,
      isAvailable,
      sortOrder,
    } = req.body;

    const item = await prisma.menuItem.update({
      where: {
        id: itemId,
      },
      data: {
        ...(categoryId !== undefined && {
          categoryId: Number(categoryId),
        }),

        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(description !== undefined && {
          description:
            description?.trim() || null,
        }),

        ...(price !== undefined && {
          price: Number(price),
        }),

        ...(imageUrl !== undefined && {
          imageUrl:
            imageUrl?.trim() || null,
        }),

        ...(featured !== undefined && {
          featured: Boolean(featured),
        }),

        ...(isAvailable !== undefined && {
          isAvailable: Boolean(isAvailable),
        }),

        ...(sortOrder !== undefined && {
          sortOrder: Number(sortOrder),
        }),
      },
      include: {
        category: true,
      },
    });

    return res.json({
      success: true,
      message: "Menu item updated successfully.",
      item,
    });
  } catch (error) {
    console.error("Update menu item error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update menu item.",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID.",
      });
    }

    await prisma.menuItem.delete({
      where: {
        id: itemId,
      },
    });

    return res.json({
      success: true,
      message: "Menu item deleted successfully.",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete menu item.",
    });
  }
};

module.exports = {
  getMenu,
  getMenuCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};