const prisma = require("../config/prisma");

const {
  sendEnquiryNotification,
  sendCustomerConfirmation,
  sendCustomerEnquiryReply,
} = require("../services/emailService");

const createEnquiry = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      eventType,
      eventDate,
      guests,
      message,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        eventType: eventType.trim(),
        eventDate: eventDate ? new Date(eventDate) : null,
        guests: guests ? Number(guests) : null,
        message: message?.trim() || null,
      },
    });

        let emailSent = false;
let customerEmailSent = false;

try {
  await sendEnquiryNotification(enquiry);
  emailSent = true;

  console.log(
    `Business notification sent for enquiry #${enquiry.id}`
  );
} catch (emailError) {
  console.error(
    "Business email notification failed:",
    emailError
  );
}

try {
  await sendCustomerConfirmation(enquiry);
  customerEmailSent = true;

  console.log(
    `Customer confirmation sent to ${enquiry.email}`
  );
} catch (emailError) {
  console.error(
    "Customer confirmation email failed:",
    emailError
  );
}

        return res.status(201).json({
  success: true,
  message: "Your enquiry has been submitted successfully.",
  emailSent,
  customerEmailSent,
  enquiry,
});
  } catch (error) {
    console.error("Create enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your enquiry.",
    });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve enquiries.",
    });
  }
};


const getEnquiryById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: {
        id,
      },
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error("Get enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve enquiry.",
    });
  }
};


const updateEnquiryStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "NEW",
      "CONTACTED",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status.",
      });
    }

    const enquiry = await prisma.enquiry.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.json({
      success: true,
      message: "Enquiry status updated successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Update enquiry status error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update enquiry status.",
    });
  }
};

const replyToEnquiry = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { message } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a reply message.",
      });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Reply message must contain at least 5 characters.",
      });
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    await sendCustomerEnquiryReply(
      enquiry,
      message.trim()
    );

    return res.json({
      success: true,
      message: "Reply sent successfully.",
      enquiryId: enquiry.id,
      email: enquiry.email,
    });
  } catch (error) {
    console.error(
      "Reply to enquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to send enquiry reply.",
    });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    await prisma.enquiry.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete enquiry.",
    });
  }
};


module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  replyToEnquiry,
  deleteEnquiry,
};
