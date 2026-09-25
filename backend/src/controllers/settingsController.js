
const prisma = require("../config/prisma");

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings = {
  businessName: "Etjanini",
  tagline: "",
  phone: "",
  email: "",
  whatsapp: "",

  address: "KwaMhlanga",
  city: "KwaMhlanga",
  province: "Mpumalanga",
  country: "South Africa",

  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  mapsUrl: "",

  bookingEmail: "",

  mondayHours: "",
  tuesdayHours: "",
  wednesdayHours: "",
  thursdayHours: "",
  fridayHours: "",
  saturdayHours: "",
  sundayHours: "",

  isOpen: true,
};


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

/*
  Safely convert a value into a trimmed string.

  Examples:

  null       -> ""
  undefined  -> ""
  " Etjanini " -> "Etjanini"
*/

const cleanString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};


/*
  Convert optional text fields into either:

  "some value"

  OR

  null

  This works well with nullable Prisma fields.
*/

const nullableString = (value) => {
  const cleaned = cleanString(value);

  return cleaned || null;
};


/* =========================================================
   GET OR CREATE SETTINGS
========================================================= */

const getOrCreateSettings = async () => {

  let settings =
    await prisma.siteSettings.findFirst();


  if (!settings) {

    settings =
      await prisma.siteSettings.create({
        data: defaultSettings,
      });

  }


  return settings;
};


/* =========================================================
   GET PUBLIC SETTINGS
========================================================= */

const getPublicSettings = async (
  req,
  res
) => {

  try {

    const settings =
      await getOrCreateSettings();


    return res.json({
      success: true,
      settings,
    });

  } catch (error) {

    console.error(
      "Get public settings error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to load site settings.",
    });

  }

};


/* =========================================================
   GET ADMIN SETTINGS
========================================================= */

const getSettings = async (
  req,
  res
) => {

  try {

    const settings =
      await getOrCreateSettings();


    return res.json({
      success: true,
      settings,
    });

  } catch (error) {

    console.error(
      "Get settings error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to load settings.",
    });

  }

};


/* =========================================================
   UPDATE SETTINGS
========================================================= */

const updateSettings = async (
  req,
  res
) => {

  try {

    const settings =
      await getOrCreateSettings();


    const {
      businessName,
      tagline,
      phone,
      email,
      whatsapp,

      address,
      city,
      province,
      country,

      instagramUrl,
      facebookUrl,
      tiktokUrl,
      mapsUrl,

      bookingEmail,

      mondayHours,
      tuesdayHours,
      wednesdayHours,
      thursdayHours,
      fridayHours,
      saturdayHours,
      sundayHours,

      isOpen,
    } = req.body;


    /* =====================================================
       BUILD UPDATE DATA SAFELY
    ====================================================== */

    const updateData = {};


    /* -----------------------------------------------------
       BUSINESS INFORMATION
    ------------------------------------------------------ */

    if (businessName !== undefined) {

      updateData.businessName =
        cleanString(businessName) ||
        "Etjanini";

    }


    if (tagline !== undefined) {

      updateData.tagline =
        nullableString(tagline);

    }


    if (phone !== undefined) {

      updateData.phone =
        nullableString(phone);

    }


    if (email !== undefined) {

      updateData.email =
        nullableString(email);

    }


    if (whatsapp !== undefined) {

      updateData.whatsapp =
        nullableString(whatsapp);

    }


    /* -----------------------------------------------------
       LOCATION
    ------------------------------------------------------ */

    if (address !== undefined) {

      updateData.address =
        nullableString(address);

    }


    if (city !== undefined) {

      updateData.city =
        nullableString(city);

    }


    if (province !== undefined) {

      updateData.province =
        nullableString(province);

    }


    if (country !== undefined) {

      updateData.country =
        nullableString(country);

    }


    /* -----------------------------------------------------
       SOCIAL MEDIA
    ------------------------------------------------------ */

    if (instagramUrl !== undefined) {

      updateData.instagramUrl =
        nullableString(instagramUrl);

    }


    if (facebookUrl !== undefined) {

      updateData.facebookUrl =
        nullableString(facebookUrl);

    }


    if (tiktokUrl !== undefined) {

      updateData.tiktokUrl =
        nullableString(tiktokUrl);

    }


    if (mapsUrl !== undefined) {

      updateData.mapsUrl =
        nullableString(mapsUrl);

    }


    /* -----------------------------------------------------
       BOOKING
    ------------------------------------------------------ */

    if (bookingEmail !== undefined) {

      updateData.bookingEmail =
        nullableString(bookingEmail);

    }


    /* -----------------------------------------------------
       OPENING HOURS
    ------------------------------------------------------ */

    if (mondayHours !== undefined) {

      updateData.mondayHours =
        nullableString(mondayHours);

    }


    if (tuesdayHours !== undefined) {

      updateData.tuesdayHours =
        nullableString(tuesdayHours);

    }


    if (wednesdayHours !== undefined) {

      updateData.wednesdayHours =
        nullableString(wednesdayHours);

    }


    if (thursdayHours !== undefined) {

      updateData.thursdayHours =
        nullableString(thursdayHours);

    }


    if (fridayHours !== undefined) {

      updateData.fridayHours =
        nullableString(fridayHours);

    }


    if (saturdayHours !== undefined) {

      updateData.saturdayHours =
        nullableString(saturdayHours);

    }


    if (sundayHours !== undefined) {

      updateData.sundayHours =
        nullableString(sundayHours);

    }


    /* -----------------------------------------------------
       OPEN / CLOSED STATUS
    ------------------------------------------------------ */

    if (isOpen !== undefined) {

      updateData.isOpen =
        Boolean(isOpen);

    }


    /* =====================================================
       UPDATE DATABASE
    ====================================================== */

    const updatedSettings =
      await prisma.siteSettings.update({

        where: {
          id: settings.id,
        },

        data: updateData,

      });


    /* =====================================================
       RESPONSE
    ====================================================== */

    return res.json({

      success: true,

      message:
        "Site settings updated successfully.",

      settings:
        updatedSettings,

    });

  } catch (error) {

    console.error(
      "Update settings error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to update site settings.",

    });

  }

};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  getPublicSettings,

  getSettings,

  updateSettings,

};
