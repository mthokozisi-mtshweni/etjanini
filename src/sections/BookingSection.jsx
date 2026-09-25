import { useState } from "react";
import {
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiUsers,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  guests: "",
  message: "",
};

function BookingSection() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Remove old messages when the user starts editing again.
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            eventType: formData.eventType,
            eventDate: formData.eventDate || null,
            guests: formData.guests
              ? Number(formData.guests)
              : null,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your enquiry."
        );
      }

      setSuccessMessage(
        "Thank you. Your enquiry has been submitted successfully. Our team will be in touch."
      );

      setFormData(initialFormData);
    } catch (error) {
      console.error("Enquiry submission error:", error);

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="booking-section">
      <div className="booking-container">

        <div className="booking-heading">
          <span className="section-eyebrow">
            BOOK / ENQUIRE
          </span>

          <h2>
            Let's Plan Your
            <span> Occasion.</span>
          </h2>

          <p>
            Tell us a little about your event and our team can help
            you plan an experience that suits your occasion.
          </p>
        </div>

        <div className="booking-layout">

          {/* Information panel */}
          <aside className="booking-info">

            <div className="booking-info-top">
              <span>START YOUR ENQUIRY</span>

              <h3>
                Your next memorable
                <em> moment starts here.</em>
              </h3>
            </div>

            <div className="booking-info-items">

              <div className="booking-info-item">
                <span className="booking-info-icon">
                  <FiCalendar />
                </span>

                <div>
                  <strong>Choose your date</strong>
                  <p>
                    Let us know when you are planning your
                    occasion.
                  </p>
                </div>
              </div>

              <div className="booking-info-item">
                <span className="booking-info-icon">
                  <FiUsers />
                </span>

                <div>
                  <strong>Tell us your guest count</strong>
                  <p>
                    We will help you find a suitable setup for
                    your group.
                  </p>
                </div>
              </div>

              <div className="booking-info-item">
                <span className="booking-info-icon">
                  <FiCheckCircle />
                </span>

                <div>
                  <strong>We'll take it from there</strong>
                  <p>
                    Our team can discuss availability,
                    requirements and next steps.
                  </p>
                </div>
              </div>

            </div>

            <div className="booking-contact">

              <span>OR CONTACT US DIRECTLY</span>

              <a href="tel:+27000000000">
                <FiPhone />
                <span>Call Etjanini</span>
              </a>

              <a href="mailto:info@etjanini.co.za">
                <FiMail />
                <span>info@etjanini.co.za</span>
              </a>

            </div>

          </aside>

          {/* Form */}
          <div className="booking-form-wrapper">

            <form
              className="booking-form"
              onSubmit={handleSubmit}
            >

              <div className="booking-form-header">
                <span>EVENT ENQUIRY</span>

                <h3>
                  Tell us about your event.
                </h3>
              </div>

              <div className="booking-form-grid">

                <div className="form-field">
                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="eventType">
                    Event Type
                  </label>

                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select event type
                    </option>

                    <option value="restaurant">
                      Restaurant Booking
                    </option>

                    <option value="wedding">
                      Wedding
                    </option>

                    <option value="conference">
                      Conference
                    </option>

                    <option value="function">
                      Private Function
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="eventDate">
                    Event Date
                  </label>

                  <input
                    id="eventDate"
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="guests">
                    Number of Guests
                  </label>

                  <input
                    id="guests"
                    type="number"
                    name="guests"
                    min="1"
                    placeholder="e.g. 80"
                    value={formData.guests}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="message">
                    Tell Us More
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Tell us about your event, preferred setup, catering requirements or anything else we should know..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

              </div>

              {/* Success message */}
              {successMessage && (
                <div
                  className="booking-message booking-message-success"
                  role="status"
                >
                  <FiCheckCircle />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error message */}
              {errorMessage && (
                <div
                  className="booking-message booking-message-error"
                  role="alert"
                >
                  <FiAlertCircle />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="booking-form-footer">

                <p>
                  By submitting this form, you are sending an
                  enquiry to the Etjanini team.
                </p>

                <button
                  type="submit"
                  className="booking-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="booking-spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <FiArrowUpRight />
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}

export default BookingSection;