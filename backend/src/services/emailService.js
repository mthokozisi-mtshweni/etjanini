const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEnquiryNotification = async (enquiry) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [process.env.EMAIL_TO],
    subject: `New Etjanini Enquiry — ${enquiry.eventType}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #222;">
        
        <div style="background: #11100e; padding: 30px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0;">ETJANINI</h1>
          <p style="color: #f4efe6; margin: 8px 0 0;">
            RESTAURANT • EVENTS • VENUE
          </p>
        </div>

        <div style="padding: 30px; background: #ffffff;">
          <h2>New Event Enquiry</h2>

          <p>
            A new enquiry has been submitted through the Etjanini website.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />

          <h3>Customer Details</h3>

          <p><strong>Name:</strong> ${enquiry.fullName}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone}</p>

          <h3>Event Details</h3>

          <p><strong>Event Type:</strong> ${enquiry.eventType}</p>

          <p>
            <strong>Event Date:</strong>
            ${
              enquiry.eventDate
                ? new Date(enquiry.eventDate).toLocaleDateString("en-ZA")
                : "Not specified"
            }
          </p>

          <p>
            <strong>Number of Guests:</strong>
            ${enquiry.guests || "Not specified"}
          </p>

          <h3>Message</h3>

          <div style="
            background: #f4efe6;
            padding: 20px;
            border-radius: 8px;
            line-height: 1.6;
          ">
            ${enquiry.message || "No additional message provided."}
          </div>

          <p style="margin-top: 30px; font-size: 13px; color: #777;">
            Enquiry ID: #${enquiry.id}
          </p>
        </div>

        <div style="
          background: #181613;
          padding: 20px;
          text-align: center;
          color: #b8b0a4;
          font-size: 13px;
        ">
          Etjanini • KwaMhlanga • Mpumalanga • South Africa
        </div>

      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send enquiry notification.");
  }

  return data;
};


const sendCustomerConfirmation = async (enquiry) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [enquiry.email],

    subject: "We've received your Etjanini enquiry",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: 0 auto;
        color: #222;
        background: #ffffff;
      ">

        <div style="
          background: #11100e;
          padding: 35px 30px;
          text-align: center;
        ">
          <h1 style="
            color: #c9a96e;
            margin: 0;
            letter-spacing: 3px;
          ">
            ETJANINI
          </h1>

          <p style="
            color: #f4efe6;
            margin: 10px 0 0;
            font-size: 12px;
            letter-spacing: 1px;
          ">
            RESTAURANT • EVENTS • VENUE
          </p>
        </div>

        <div style="padding: 35px 30px;">

          <p style="font-size: 16px;">
            Dear ${enquiry.fullName},
          </p>

          <h2 style="
            color: #11100e;
            margin-top: 25px;
          ">
            Thank you for contacting Etjanini.
          </h2>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #555;
          ">
            We have received your enquiry and our team will review
            the details you provided. We will contact you to discuss
            availability and the next steps for your occasion.
          </p>

          <div style="
            background: #f4efe6;
            padding: 22px;
            margin: 30px 0;
            border-left: 4px solid #c9a96e;
          ">

            <h3 style="margin-top: 0;">
              Your Enquiry
            </h3>

            <p>
              <strong>Event:</strong>
              ${enquiry.eventType}
            </p>

            <p>
              <strong>Date:</strong>
              ${
                enquiry.eventDate
                  ? new Date(enquiry.eventDate).toLocaleDateString("en-ZA")
                  : "Not specified"
              }
            </p>

            <p>
              <strong>Guests:</strong>
              ${enquiry.guests || "Not specified"}
            </p>

            <p>
              <strong>Reference:</strong>
              #${enquiry.id}
            </p>

          </div>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #555;
          ">
            Please keep this email for your reference.
            There is no need to submit another enquiry unless
            you need to provide additional information.
          </p>

          <p style="
            margin-top: 35px;
            font-size: 15px;
          ">
            We look forward to helping you create a memorable occasion.
          </p>

          <p style="
            font-family: Georgia, serif;
            font-size: 20px;
            color: #11100e;
          ">
            The Etjanini Team
          </p>

        </div>

        <div style="
          background: #181613;
          padding: 22px;
          text-align: center;
          color: #b8b0a4;
          font-size: 12px;
        ">
          Etjanini<br />
          KwaMhlanga • Mpumalanga • South Africa
        </div>

      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send customer confirmation.");
  }

  return data;
};

const sendCustomerEnquiryReply = async (enquiry, replyMessage) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [enquiry.email],

    subject: `Re: Your Etjanini enquiry #${enquiry.id}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: 0 auto;
        color: #222;
        background: #ffffff;
      ">

        <div style="
          background: #11100e;
          padding: 35px 30px;
          text-align: center;
        ">
          <h1 style="
            color: #c9a96e;
            margin: 0;
            letter-spacing: 3px;
          ">
            ETJANINI
          </h1>

          <p style="
            color: #f4efe6;
            margin: 10px 0 0;
            font-size: 12px;
            letter-spacing: 1px;
          ">
            RESTAURANT • EVENTS • VENUE
          </p>
        </div>

        <div style="padding: 35px 30px;">

          <p style="font-size: 16px;">
            Dear ${enquiry.fullName},
          </p>

          <h2 style="
            color: #11100e;
            margin-top: 25px;
          ">
            A message from Etjanini
          </h2>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #555;
          ">
            Thank you for contacting Etjanini. Our team has reviewed
            your enquiry and we have the following response for you:
          </p>

          <div style="
            background: #f4efe6;
            padding: 22px;
            margin: 30px 0;
            border-left: 4px solid #c9a96e;
            border-radius: 4px;
          ">

            <p style="
              margin: 0;
              font-size: 15px;
              line-height: 1.8;
              white-space: pre-line;
            ">
              ${replyMessage}
            </p>

          </div>

          <div style="
            border-top: 1px solid #e5e5e5;
            padding-top: 22px;
            margin-top: 30px;
          ">

            <h3 style="
              color: #11100e;
              margin-top: 0;
            ">
              Your Enquiry
            </h3>

            <p>
              <strong>Event:</strong>
              ${enquiry.eventType}
            </p>

            <p>
              <strong>Date:</strong>
              ${
                enquiry.eventDate
                  ? new Date(enquiry.eventDate).toLocaleDateString("en-ZA")
                  : "Not specified"
              }
            </p>

            <p>
              <strong>Guests:</strong>
              ${enquiry.guests || "Not specified"}
            </p>

            <p>
              <strong>Reference:</strong>
              #${enquiry.id}
            </p>

          </div>

          <p style="
            margin-top: 35px;
            font-size: 15px;
            line-height: 1.7;
            color: #555;
          ">
            If you have any further questions, please reply to this email
            or contact the Etjanini team directly.
          </p>

          <p style="
            margin-top: 30px;
            font-family: Georgia, serif;
            font-size: 20px;
            color: #11100e;
          ">
            The Etjanini Team
          </p>

        </div>

        <div style="
          background: #181613;
          padding: 22px;
          text-align: center;
          color: #b8b0a4;
          font-size: 12px;
        ">
          Etjanini<br />
          KwaMhlanga • Mpumalanga • South Africa
        </div>

      </div>
    `,
  });

  if (error) {
    throw new Error(
      error.message || "Failed to send customer enquiry reply."
    );
  }

  return data;
};

module.exports = {
  sendEnquiryNotification,
  sendCustomerConfirmation,
  sendCustomerEnquiryReply,
};