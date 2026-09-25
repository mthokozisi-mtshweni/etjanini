import {
  FiArrowUpRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import { useSiteSettings } from "../context/SiteSettingsContext";

function ContactSection() {
  const { settings, loading } = useSiteSettings();

  const business = settings || {
    businessName: "Etjanini",
    phone: "",
    email: "",
    address: "KwaMhlanga",
    city: "KwaMhlanga",
    province: "Mpumalanga",
    country: "South Africa",
    mapsUrl: "",
    mondayHours: "",
    tuesdayHours: "",
    wednesdayHours: "",
    thursdayHours: "",
    fridayHours: "",
    saturdayHours: "",
    sundayHours: "",
  };

  const location = [
    business.address,
    business.city,
    business.province,
  ]
    .filter(Boolean)
    .join(", ");

  const hours = [
    ["Monday", business.mondayHours],
    ["Tuesday", business.tuesdayHours],
    ["Wednesday", business.wednesdayHours],
    ["Thursday", business.thursdayHours],
    ["Friday", business.fridayHours],
    ["Saturday", business.saturdayHours],
    ["Sunday", business.sundayHours],
  ].filter(([, value]) => value);

  return (
    <section className="contact-section" id="contact">
      <div className="contact-section-inner">

        <div className="contact-section-heading">
          <span className="section-eyebrow">
            GET IN TOUCH
          </span>

          <h2>
            Let&apos;s Make Your
            <br />
            <em>Next Moment</em> Special.
          </h2>

          <p>
            Whether you are planning a dinner, wedding,
            conference, or private function, our team is
            ready to help.
          </p>
        </div>

        <div className="contact-section-grid">

          {/* CONTACT INFORMATION */}
          <div className="contact-info-card">

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <FiMapPin />
              </div>

              <div>
                <span>VISIT US</span>

                <strong>
                  {loading
                    ? "Loading..."
                    : location || "KwaMhlanga, Mpumalanga"}
                </strong>

                {business.mapsUrl && (
                  <a
                    href={business.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-info-link"
                  >
                    Get Directions
                    <FiArrowUpRight />
                  </a>
                )}
              </div>
            </div>

            {business.phone && (
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FiPhone />
                </div>

                <div>
                  <span>CALL US</span>

                  <a href={`tel:${business.phone}`}>
                    {business.phone}
                  </a>
                </div>
              </div>
            )}

            {business.email && (
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FiMail />
                </div>

                <div>
                  <span>EMAIL US</span>

                  <a href={`mailto:${business.email}`}>
                    {business.email}
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* OPENING HOURS */}
          <div className="contact-hours-card">

            <div className="contact-hours-header">
              <div className="contact-info-icon">
                <FiClock />
              </div>

              <div>
                <span>OPENING HOURS</span>
                <h3>Come Visit Us</h3>
              </div>
            </div>

            {hours.length > 0 ? (
              <div className="contact-hours-list">
                {hours.map(([day, time]) => (
                  <div
                    className="contact-hours-row"
                    key={day}
                  >
                    <span>{day}</span>
                    <strong>{time}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="contact-hours-empty">
                Opening hours will be updated soon.
              </p>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactSection;