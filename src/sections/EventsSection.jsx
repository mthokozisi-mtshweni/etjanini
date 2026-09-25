import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiCalendar,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/events/public`
        );

        const data =
          await response.json();

        if (response.ok && data.success) {
          setEvents(
            (data.events || []).slice(0, 3)
          );
        }
      } catch (error) {
        console.error(
          "Homepage events error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <section
      className="events-section"
      id="events"
    >
      <div className="section-container">

        <div className="section-heading">

          <div>
            <span className="section-eyebrow">
              ETJANINI EXPERIENCES
            </span>

            <h2>
              Moments Made
              <br />
              <em>To Be Remembered.</em>
            </h2>
          </div>

          <div className="section-heading-side">
            <p>
              From beautiful weddings to
              memorable celebrations and
              professional gatherings,
              Etjanini provides the setting
              for moments that matter.
            </p>

            <Link
              to="/events"
              className="section-text-link"
            >
              View All Events
              <FiArrowUpRight />
            </Link>
          </div>

        </div>

        {loading ? (
          <div className="events-home-loading">
            <FiCalendar />
            <span>
              Loading upcoming events...
            </span>
          </div>
        ) : events.length === 0 ? (
          <div className="events-home-empty">

            <FiCalendar />

            <h3>
              Something special is
              coming.
            </h3>

            <p>
              Check back soon for upcoming
              Etjanini events.
            </p>

          </div>
        ) : (
          <div className="events-home-grid">

            {events.map((event) => (
              <article
                className="events-home-card"
                key={event.id}
              >

                <div className="events-home-image">

                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                    />
                  ) : (
                    <div className="events-home-placeholder">
                      <FiCalendar />
                    </div>
                  )}

                  {event.featured && (
                    <span className="events-home-featured">
                      Featured
                    </span>
                  )}

                </div>

                <div className="events-home-content">

                  <span className="events-home-type">
                    {event.eventType}
                  </span>

                  <h3>
                    {event.title}
                  </h3>

                  {event.description && (
                    <p>
                      {event.description}
                    </p>
                  )}

                  <div className="events-home-meta">

                    <span>
                      <FiCalendar />
                      {formatEventDate(
                        event.eventDate
                      )}
                    </span>

                    {event.location && (
                      <span>
                        <FiMapPin />
                        {event.location}
                      </span>
                    )}

                    {event.capacity && (
                      <span>
                        <FiUsers />
                        Up to{" "}
                        {event.capacity} guests
                      </span>
                    )}

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

function formatEventDate(date) {
  if (!date) {
    return "Date to be confirmed";
  }

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

export default EventsSection;