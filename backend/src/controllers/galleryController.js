const prisma = require("../config/prisma");

const createGalleryImage = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      category,
      featured,
      isPublished,
      sortOrder,
    } = req.body;

    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required.",
      });
    }

    const image = await prisma.galleryImage.create({
      data: {
        title: title?.trim() || null,
        description:
          description?.trim() || null,
        imageUrl: imageUrl.trim(),
        category:
          category?.trim() || "General",
        featured: Boolean(featured),
        isPublished:
          isPublished !== undefined
            ? Boolean(isPublished)
            : true,
        sortOrder:
          sortOrder !== undefined
            ? Number(sortOrder)
            : 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Gallery image created successfully.",
      image,
    });
  } catch (error) {
    console.error(
      "Create gallery image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create gallery image.",
    });
  }
};

const getGalleryImages = async (req, res) => {
  try {
    const images =
      await prisma.galleryImage.findMany({
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error(
      "Get gallery images error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load gallery images.",
    });
  }
};

const getPublicGallery = async (req, res) => {
  try {
    const images =
      await prisma.galleryImage.findMany({
        where: {
          isPublished: true,
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

    return res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error(
      "Get public gallery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load gallery.",
    });
  }
};

const getGalleryImageById = async (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    const image =
      await prisma.galleryImage.findUnique({
        where: {
          id,
        },
      });

    if (!image) {
      return res.status(404).json({
        success: false,
        message:
          "Gallery image not found.",
      });
    }

    return res.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error(
      "Get gallery image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load gallery image.",
    });
  }
};

const updateGalleryImage = async (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    const {
      title,
      description,
      imageUrl,
      category,
      featured,
      isPublished,
      sortOrder,
    } = req.body;

    const image =
      await prisma.galleryImage.update({
        where: {
          id,
        },
        data: {
          ...(title !== undefined && {
            title:
              title?.trim() || null,
          }),

          ...(description !== undefined && {
            description:
              description?.trim() || null,
          }),

          ...(imageUrl !== undefined && {
            imageUrl:
              imageUrl?.trim() || "",
          }),

          ...(category !== undefined && {
            category:
              category?.trim() || "General",
          }),

          ...(featured !== undefined && {
            featured: Boolean(featured),
          }),

          ...(isPublished !== undefined && {
            isPublished:
              Boolean(isPublished),
          }),

          ...(sortOrder !== undefined && {
            sortOrder: Number(sortOrder),
          }),
        },
      });

    return res.json({
      success: true,
      message:
        "Gallery image updated successfully.",
      image,
    });
  } catch (error) {
    console.error(
      "Update gallery image error:",
      error
    );

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message:
          "Gallery image not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update gallery image.",
    });
  }
};

const deleteGalleryImage = async (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    await prisma.galleryImage.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message:
        "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete gallery image error:",
      error
    );

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message:
          "Gallery image not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete gallery image.",
    });
  }
};

module.exports = {
  createGalleryImage,
  getGalleryImages,
  getPublicGallery,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
};