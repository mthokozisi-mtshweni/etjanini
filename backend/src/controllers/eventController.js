const prisma = require("../config/prisma");


/* =========================================================
   SLUG HELPERS
========================================================= */

const createSlug = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};


const createUniqueSlug = async (
  title,
  excludeId = null
) => {
  const baseSlug = createSlug(title);

  if (!baseSlug) {
    throw new Error("Unable to generate event slug.");
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existingEvent =
      await prisma.event.findUnique({
        where: {
          slug,
        },
      });

    if (
      !existingEvent ||
      existingEvent.id === excludeId
    ) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};


/* =========================================================
   CREATE EVENT
========================================================= */

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      eventDate,
      endDate,
      location,
      capacity,
      imageUrl,
      featured,
      isPublished,
    } = req.body;

    if (
      !title ||
      !eventType ||
      !eventDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, event type and event date are required.",
      });
    }

    const cleanTitle = title.trim();

    const slug =
      await createUniqueSlug(cleanTitle);

    const event =
      await prisma.event.create({
        data: {
          title: cleanTitle,

          slug,

          description:
            description?.trim() || null,

          eventType:
            eventType.trim(),

          eventDate:
            new Date(eventDate),

          endDate:
            endDate
              ? new Date(endDate)
              : null,

          location:
            location?.trim() || null,

          capacity:
            capacity
              ? Number(capacity)
              : null,

          imageUrl:
            imageUrl?.trim() || null,

          featured:
            Boolean(featured),

          isPublished:
            Boolean(isPublished),
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Event created successfully.",
      event,
    });

  } catch (error) {
    console.error(
      "Create event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create event.",
    });
  }
};


/* =========================================================
   GET ALL EVENTS
========================================================= */

const getEvents = async (req, res) => {
  try {
    const events =
      await prisma.event.findMany({
        orderBy: {
          eventDate: "asc",
        },
      });

    return res.json({
      success: true,
      events,
    });

  } catch (error) {
    console.error(
      "Get events error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load events.",
    });
  }
};


/* =========================================================
   GET PUBLIC EVENTS
========================================================= */

const getPublicEvents = async (
  req,
  res
) => {
  try {
    const events =
      await prisma.event.findMany({
        where: {
          isPublished: true,
        },

        orderBy: {
          eventDate: "asc",
        },
      });

    return res.json({
      success: true,
      events,
    });

  } catch (error) {
    console.error(
      "Get public events error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load events.",
    });
  }
};


/* =========================================================
   GET EVENT BY ID
========================================================= */

const getEventById = async (
  req,
  res
) => {
  try {
    const id =
      Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid event ID.",
      });
    }

    const event =
      await prisma.event.findUnique({
        where: {
          id,
        },
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message:
          "Event not found.",
      });
    }

    return res.json({
      success: true,
      event,
    });

  } catch (error) {
    console.error(
      "Get event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load event.",
    });
  }
};


/* =========================================================
   UPDATE EVENT
========================================================= */

const updateEvent = async (
  req,
  res
) => {
  try {
    const id =
      Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid event ID.",
      });
    }

    const {
      title,
      description,
      eventType,
      eventDate,
      endDate,
      location,
      capacity,
      imageUrl,
      featured,
      isPublished,
    } = req.body;


    /* -------------------------------------------------------
       Build update data
    -------------------------------------------------------- */

    const updateData = {};


    if (title !== undefined) {
      const cleanTitle =
        String(title).trim();

      updateData.title =
        cleanTitle;

      /*
       * Only regenerate the slug
       * when the title changes.
       */
      updateData.slug =
        await createUniqueSlug(
          cleanTitle,
          id
        );
    }


    if (
      description !== undefined
    ) {
      updateData.description =
        description?.trim() || null;
    }


    if (
      eventType !== undefined
    ) {
      updateData.eventType =
        eventType.trim();
    }


    if (
      eventDate !== undefined
    ) {
      updateData.eventDate =
        new Date(eventDate);
    }


    if (
      endDate !== undefined
    ) {
      updateData.endDate =
        endDate
          ? new Date(endDate)
          : null;
    }


    if (
      location !== undefined
    ) {
      updateData.location =
        location?.trim() || null;
    }


    if (
      capacity !== undefined
    ) {
      updateData.capacity =
        capacity
          ? Number(capacity)
          : null;
    }


    if (
      imageUrl !== undefined
    ) {
      updateData.imageUrl =
        imageUrl?.trim() || null;
    }


    if (
      featured !== undefined
    ) {
      updateData.featured =
        Boolean(featured);
    }


    if (
      isPublished !== undefined
    ) {
      updateData.isPublished =
        Boolean(isPublished);
    }


    /* -------------------------------------------------------
       Update event
    -------------------------------------------------------- */

    const event =
      await prisma.event.update({
        where: {
          id,
        },

        data: updateData,
      });


    return res.json({
      success: true,
      message:
        "Event updated successfully.",
      event,
    });

  } catch (error) {
    console.error(
      "Update event error:",
      error
    );

    if (
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An event with this slug already exists.",
      });
    }

    if (
      error.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Event not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update event.",
    });
  }
};


/* =========================================================
   DELETE EVENT
========================================================= */

const deleteEvent = async (
  req,
  res
) => {
  try {
    const id =
      Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid event ID.",
      });
    }

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message:
        "Event deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete event error:",
      error
    );

    if (
      error.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Event not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete event.",
    });
  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createEvent,
  getEvents,
  getPublicEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};