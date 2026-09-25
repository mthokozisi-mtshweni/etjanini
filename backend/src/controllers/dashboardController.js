
const prisma = require("../config/prisma");


/* =========================================================
   GET DASHBOARD STATISTICS
========================================================= */

const getDashboardStats = async (req, res) => {

  try {

    /* =====================================================
       ENQUIRY COUNTS
    ====================================================== */

    const totalEnquiries =
      await prisma.enquiry.count();


    const newEnquiries =
      await prisma.enquiry.count({
        where: {
          status: "NEW",
        },
      });


    const contactedEnquiries =
      await prisma.enquiry.count({
        where: {
          status: "CONTACTED",
        },
      });


    const confirmedEnquiries =
      await prisma.enquiry.count({
        where: {
          status: "CONFIRMED",
        },
      });


    const completedEnquiries =
      await prisma.enquiry.count({
        where: {
          status: "COMPLETED",
        },
      });


    const cancelledEnquiries =
      await prisma.enquiry.count({
        where: {
          status: "CANCELLED",
        },
      });


    /* =====================================================
       MENU COUNTS
    ====================================================== */

    const totalMenuCategories =
      await prisma.menuCategory.count();


    const activeMenuCategories =
      await prisma.menuCategory.count({
        where: {
          isActive: true,
        },
      });


    const totalMenuItems =
      await prisma.menuItem.count();


    const availableMenuItems =
      await prisma.menuItem.count({
        where: {
          isAvailable: true,
        },
      });


    const featuredMenuItems =
      await prisma.menuItem.count({
        where: {
          featured: true,
        },
      });


    /* =====================================================
       EVENT COUNTS
    ====================================================== */

    const totalEvents =
      await prisma.event.count();


    const publishedEvents =
      await prisma.event.count({
        where: {
          isPublished: true,
        },
      });


    const featuredEvents =
      await prisma.event.count({
        where: {
          featured: true,
        },
      });


    /* =====================================================
       UPCOMING EVENTS
    ====================================================== */

    const upcomingEvents =
      await prisma.event.count({
        where: {
          eventDate: {
            gte: new Date(),
          },
          isPublished: true,
        },
      });


    /* =====================================================
       GALLERY COUNTS
    ====================================================== */

    const totalGalleryImages =
      await prisma.galleryImage.count();


    const publishedGalleryImages =
      await prisma.galleryImage.count({
        where: {
          isPublished: true,
        },
      });


    const featuredGalleryImages =
      await prisma.galleryImage.count({
        where: {
          featured: true,
        },
      });


    /* =====================================================
       RECENT ENQUIRIES
    ====================================================== */

    const recentEnquiries =
      await prisma.enquiry.findMany({

        orderBy: {
          createdAt: "desc",
        },

        take: 6,

        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          eventType: true,
          eventDate: true,
          guests: true,
          status: true,
          createdAt: true,
        },

      });


    /* =====================================================
       UPCOMING EVENTS LIST
    ====================================================== */

    const upcomingEventList =
      await prisma.event.findMany({

        where: {
          eventDate: {
            gte: new Date(),
          },

          isPublished: true,
        },

        orderBy: {
          eventDate: "asc",
        },

        take: 5,

        select: {
          id: true,
          title: true,
          slug: true,
          eventType: true,
          eventDate: true,
          endDate: true,
          location: true,
          imageUrl: true,
        },

      });


    /* =====================================================
       RESPONSE
    ====================================================== */

    return res.json({

      success: true,

      stats: {

        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          contacted: contactedEnquiries,
          confirmed: confirmedEnquiries,
          completed: completedEnquiries,
          cancelled: cancelledEnquiries,
        },


        menu: {
          categories: totalMenuCategories,
          activeCategories: activeMenuCategories,
          items: totalMenuItems,
          availableItems: availableMenuItems,
          featuredItems: featuredMenuItems,
        },


        events: {
          total: totalEvents,
          published: publishedEvents,
          featured: featuredEvents,
          upcoming: upcomingEvents,
        },


        gallery: {
          total: totalGalleryImages,
          published: publishedGalleryImages,
          featured: featuredGalleryImages,
        },

      },


      recentEnquiries,

      upcomingEvents: upcomingEventList,

    });

  } catch (error) {

    console.error(
      "Get dashboard stats error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to load dashboard statistics.",

    });

  }

};


module.exports = {
  getDashboardStats,
};
