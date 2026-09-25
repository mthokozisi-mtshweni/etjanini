import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import "./EventsPage.css";

import {
  optimizeCloudinaryImage,
  getCloudinarySrcSet,
} from "../utils/cloudinary";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/events/public`;

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeType, setActiveType] =
    useState("ALL");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load events."
          );
        }

        setEvents(data.events || []);
      } catch (err) {
        console.error(
          "Load public events error:",
          err
        );

        setError(
          err.message ||
            "Unable to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const eventTypes = useMemo(() => {
    const types = events
      .map((event) => event.eventType)
      .filter(Boolean);

    return ["ALL", ...new Set(types)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeType === "ALL") {
      return events;
    }

    return events.filter(
      (event) =>
        event.eventType === activeType
    );
  }, [events, activeType]);

  const featuredEvents = events.filter(
    (event) => event.featured
  );

  return (

    <>

    <SEO
  title="Events | Etjanini"
  description="Discover upcoming events, celebrations and experiences at Etjanini in KwaMhlanga, Mpumalanga."
  path="/events"
/>
    <main className="events-page">

      {/* HERO */}
      <section className="events-hero">

        <div className="events-hero-background" />

        <div className="events-hero-content">

          <Link
            to="/"
            className="events-back-link"
          >
            <FiArrowLeft />
            Back to Etjanini
          </Link>

          <span className="events-eyebrow">
            ETJANINI EXPERIENCES
          </span>

          <h1>
            Moments Worth
            <br />
            <em>Celebrating.</em>
          </h1>

          <p>
            Discover upcoming experiences,
            celebrations and special events
            at Etjanini.
          </p>

        </div>

      </section>

      {/* FEATURED */}
      {!loading &&
        !error &&
        featuredEvents.length > 0 && (
          <section className="events-featured-section">

            <div className="events-section-heading">
              <span className="events-eyebrow">
                FEATURED
              </span>

              <h2>
                Something Special
                <br />
                <em>Awaits.</em>
              </h2>
            </div>

            <div className="events-featured-grid">

              {featuredEvents
                .slice(0, 3)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    featured
                  />
                ))}

            </div>

          </section>
        )}

      {/* ALL EVENTS */}
      <section className="events-list-section">

        <div className="events-section-heading">

          <div>
            <span className="events-eyebrow">
              WHAT'S HAPPENING
            </span>

            <h2>
              Upcoming
              <br />
              <em>Events.</em>
            </h2>
          </div>

          <p>
            From intimate celebrations to
            unforgettable gatherings, explore
            what's happening at Etjanini.
          </p>

        </div>

        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="events-filter">

              {eventTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={
                    activeType === type
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveType(type)
                  }
                >
                  {type === "ALL"
                    ? "All Events"
                    : type}
                </button>
              ))}

            </div>
          )}

        {loading && (
          <div className="events-state">
            <FiCalendar />
            <p>
              Loading upcoming events...
            </p>
          </div>
        )}

        {error && (
          <div className="events-state events-state-error">
            <FiCalendar />

            <h3>
              Events are temporarily
              unavailable.
            </h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredEvents.length === 0 && (
            <div className="events-state">

              <FiCalendar />

              <h3>
                No upcoming events
              </h3>

              <p>
                Check back soon for new
                Etjanini experiences.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          filteredEvents.length > 0 && (
            <div className="events-grid">

              {filteredEvents.map(
                (event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                )
              )}

            </div>
          )}

      </section>

      {/* CTA */}
      <section className="events-cta">

        <div className="events-cta-inner">

          <span className="events-eyebrow">
            PLANNING SOMETHING SPECIAL?
          </span>

          <h2>
            Make Your Next
            <br />
            <em>Moment Unforgettable.</em>
          </h2>

          <p>
            Whether you're planning a wedding,
            conference or private function,
            Etjanini is ready to host you.
          </p>

          <Link
            to="/#booking"
            className="events-cta-button"
          >
            Make an Enquiry
            <FiArrowRight />
          </Link>

        </div>

      </section>

    </main>
    </>
  );
}

function EventCard({
  event,
  featured = false,
}) {
  return (
    <article
      className={`public-event-card ${
        featured
          ? "public-event-card-featured"
          : ""
      }`}
    >

      <div className="public-event-image">

        {event.imageUrl ? (
          <img
  src={optimizeCloudinaryImage(
    event.imageUrl,
    {
      width: 1200,
      height: 800,
      crop: "fill",
    }
  )}
  srcSet={getCloudinarySrcSet(
    event.imageUrl,
    {
      height: 800,
      crop: "fill",
    }
  )}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
  alt={event.title}
  loading="lazy"
/>
        ) : (
          <div className="public-event-placeholder">
            <FiCalendar />
          </div>
        )}

        {event.featured && (
          <span className="public-event-badge">
            Featured
          </span>
        )}

      </div>

      <div className="public-event-content">

        <span className="public-event-type">
          {event.eventType}
        </span>

        <h3>{event.title}</h3>

        {event.description && (
          <p>
            {event.description}
          </p>
        )}

        <div className="public-event-details">

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
              Up to {event.capacity} guests
            </span>
          )}

        </div>

        <Link
          to="/#booking"
          className="public-event-link"
        >
          Enquire About This Event
          <FiArrowRight />
        </Link>

      </div>

    </article>
  );
}

function formatEventDate(date) {
  if (!date) return "Date to be confirmed";

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

export default EventsPage;