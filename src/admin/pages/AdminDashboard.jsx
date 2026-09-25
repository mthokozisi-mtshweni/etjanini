
import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiImage,
  FiLoader,
  FiMail,
  FiMenu,
  FiSettings,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import "../admin.css";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api`;

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DASHBOARD
  ========================================================== */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "etjanini_admin_token"
        );

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem(
            "etjanini_admin_token"
          );

          localStorage.removeItem(
            "etjanini_admin"
          );

          navigate("/admin/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load dashboard."
          );
        }

        setDashboard(data);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  /* =========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="admin-page-loading">
        <FiLoader className="admin-loading-spinner" />

        <span>
          Loading dashboard...
        </span>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-error">
          <FiXCircle />

          <div>
            <strong>
              Dashboard unavailable
            </strong>

            <span>{error}</span>
          </div>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     SAFE DATA
  ========================================================== */

  const stats = dashboard?.stats || {};

  const enquiries =
    stats.enquiries || {};

  const menu =
    stats.menu || {};

  const events =
    stats.events || {};

  const gallery =
    stats.gallery || {};

  const recentEnquiries =
    dashboard?.recentEnquiries || [];

  const upcomingEvents =
    dashboard?.upcomingEvents || [];

  /* =========================================================
     DATE FORMATTERS
  ========================================================== */

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleTimeString(
      "en-ZA",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatEventDay = (value) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
      }
    );
  };

  const formatEventMonth = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleDateString(
      "en-ZA",
      {
        month: "short",
      }
    );
  };

  return (
    <div className="admin-dashboard-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="dashboard-welcome">

        <div className="dashboard-welcome-copy">

          <span className="dashboard-eyebrow">
            ETJANINI ADMINISTRATION
          </span>

          <h1>
            Good evening.
          </h1>

          <p>
            Here&apos;s what&apos;s happening
            across your restaurant and venue.
          </p>

        </div>

        <div className="dashboard-welcome-actions">

          <button
            className="dashboard-secondary-button"
            onClick={() =>
              navigate("/admin/settings")
            }
          >
            <FiSettings />

            Settings
          </button>

          <button
            className="dashboard-primary-button"
            onClick={() =>
              navigate("/admin/enquiries")
            }
          >
            <FiMail />

            View Enquiries

            <FiArrowUpRight />
          </button>

        </div>

      </section>


      {/* =====================================================
          ENQUIRY HERO CARD
      ====================================================== */}

      <section className="dashboard-overview-card">

        <div className="dashboard-overview-heading">

          <div>

            <span className="dashboard-section-label">
              BOOKING ACTIVITY
            </span>

            <h2>
              Enquiry Overview
            </h2>

          </div>

          <div className="dashboard-total-number">
            {enquiries.total || 0}
          </div>

        </div>


        <div className="dashboard-enquiry-grid">

          <DashboardMetric
            icon={<FiMail />}
            label="New"
            value={enquiries.new}
            className="new"
          />

          <DashboardMetric
            icon={<FiClock />}
            label="Contacted"
            value={enquiries.contacted}
            className="contacted"
          />

          <DashboardMetric
            icon={<FiCheckCircle />}
            label="Confirmed"
            value={enquiries.confirmed}
            className="confirmed"
          />

          <DashboardMetric
            icon={<FiCalendar />}
            label="Completed"
            value={enquiries.completed}
            className="completed"
          />

          <DashboardMetric
            icon={<FiXCircle />}
            label="Cancelled"
            value={enquiries.cancelled}
            className="cancelled"
          />

        </div>

      </section>


      {/* =====================================================
          CONTENT STATISTICS
      ====================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="dashboard-section-label">
              WEBSITE CONTENT
            </span>

            <h2>
              Content Overview
            </h2>
          </div>

        </div>


        <div className="dashboard-content-grid">

          {/* MENU */}

          <DashboardContentCard
            icon={<FiMenu />}
            title="Menu"
            value={menu.items || 0}
            valueLabel="menu items"
            secondary={`${menu.availableItems || 0} available`}
            onClick={() =>
              navigate("/admin/menu")
            }
          />


          {/* EVENTS */}

          <DashboardContentCard
            icon={<FiCalendar />}
            title="Events"
            value={events.total || 0}
            valueLabel="events"
            secondary={`${events.published || 0} published`}
            onClick={() =>
              navigate("/admin/events")
            }
          />


          {/* GALLERY */}

          <DashboardContentCard
            icon={<FiImage />}
            title="Gallery"
            value={gallery.total || 0}
            valueLabel="images"
            secondary={`${gallery.published || 0} published`}
            onClick={() =>
              navigate("/admin/gallery")
            }
          />

        </div>

      </section>


      {/* =====================================================
          TWO COLUMN AREA
      ====================================================== */}

      <section className="dashboard-two-column">


        {/* ===================================================
            RECENT ENQUIRIES
        ==================================================== */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="dashboard-section-label">
                RECENT ACTIVITY
              </span>

              <h2>
                Recent Enquiries
              </h2>
            </div>

            <button
              className="dashboard-text-button"
              onClick={() =>
                navigate(
                  "/admin/enquiries"
                )
              }
            >
              View all
              <FiArrowUpRight />
            </button>

          </div>


          {recentEnquiries.length === 0 ? (

            <div className="dashboard-empty">

              <FiMail />

              <strong>
                No enquiries yet
              </strong>

              <span>
                New booking enquiries
                will appear here.
              </span>

            </div>

          ) : (

            <div className="dashboard-enquiries-list">

              {recentEnquiries.map(
                (enquiry) => (

                  <button
                    className="dashboard-enquiry-row"
                    key={enquiry.id}
                    onClick={() =>
                      navigate(
                        "/admin/enquiries"
                      )
                    }
                  >

                    <div className="dashboard-enquiry-avatar">
                      {enquiry.fullName
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </div>


                    <div className="dashboard-enquiry-main">

                      <strong>
                        {enquiry.fullName}
                      </strong>

                      <span>
                        {enquiry.eventType ||
                          "General enquiry"}
                      </span>

                    </div>


                    <div className="dashboard-enquiry-date">

                      <span>
                        {formatDate(
                          enquiry.eventDate
                        )}
                      </span>

                      <small>
                        {enquiry.guests
                          ? `${enquiry.guests} guests`
                          : "Guest count not provided"}
                      </small>

                    </div>


                    <StatusBadge
                      status={
                        enquiry.status
                      }
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* ===================================================
            UPCOMING EVENTS
        ==================================================== */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="dashboard-section-label">
                CALENDAR
              </span>

              <h2>
                Upcoming Events
              </h2>
            </div>

            <button
              className="dashboard-text-button"
              onClick={() =>
                navigate(
                  "/admin/events"
                )
              }
            >
              View all
              <FiArrowUpRight />
            </button>

          </div>


          {upcomingEvents.length === 0 ? (

            <div className="dashboard-empty">

              <FiCalendar />

              <strong>
                No upcoming events
              </strong>

              <span>
                Published events will
                appear here.
              </span>

            </div>

          ) : (

            <div className="dashboard-events-list">

              {upcomingEvents.map(
                (event) => (

                  <button
                    className="dashboard-event-row"
                    key={event.id}
                    onClick={() =>
                      navigate(
                        "/admin/events"
                      )
                    }
                  >

                    <div className="dashboard-event-date">

                      <strong>
                        {formatEventDay(
                          event.eventDate
                        )}
                      </strong>

                      <span>
                        {formatEventMonth(
                          event.eventDate
                        )}
                      </span>

                    </div>


                    <div className="dashboard-event-main">

                      <strong>
                        {event.title}
                      </strong>

                      <span>
                        {event.eventType}
                      </span>

                      {event.location && (
                        <small>
                          {event.location}
                        </small>
                      )}

                    </div>


                    <div className="dashboard-event-time">

                      {formatTime(
                        event.eventDate
                      )}

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="dashboard-section-label">
              QUICK MANAGEMENT
            </span>

            <h2>
              Manage Etjanini
            </h2>
          </div>

        </div>


        <div className="dashboard-actions-grid">

          <QuickAction
            icon={<FiMail />}
            title="Enquiries"
            description="Review customer bookings"
            onClick={() =>
              navigate(
                "/admin/enquiries"
              )
            }
          />

          <QuickAction
            icon={<FiMenu />}
            title="Menu"
            description="Manage dishes and prices"
            onClick={() =>
              navigate(
                "/admin/menu"
              )
            }
          />

          <QuickAction
            icon={<FiCalendar />}
            title="Events"
            description="Create and manage events"
            onClick={() =>
              navigate(
                "/admin/events"
              )
            }
          />

          <QuickAction
            icon={<FiImage />}
            title="Gallery"
            description="Update venue photography"
            onClick={() =>
              navigate(
                "/admin/gallery"
              )
            }
          />

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   DASHBOARD METRIC
========================================================= */

function DashboardMetric({
  icon,
  label,
  value,
  className = "",
}) {
  return (
    <div
      className={`dashboard-metric ${className}`}
    >

      <div className="dashboard-metric-icon">
        {icon}
      </div>

      <div>
        <span>
          {label}
        </span>

        <strong>
          {value || 0}
        </strong>
      </div>

    </div>
  );
}


/* =========================================================
   CONTENT CARD
========================================================= */

function DashboardContentCard({
  icon,
  title,
  value,
  valueLabel,
  secondary,
  onClick,
}) {
  return (
    <button
      className="dashboard-content-card"
      onClick={onClick}
    >

      <div className="dashboard-content-card-top">

        <div className="dashboard-content-icon">
          {icon}
        </div>

        <FiArrowUpRight />

      </div>


      <div className="dashboard-content-card-body">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {valueLabel}
        </small>

        <em>
          {secondary}
        </em>

      </div>

    </button>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {
  const normalized =
    String(status || "NEW")
      .toLowerCase();

  return (
    <span
      className={`dashboard-status dashboard-status-${normalized}`}
    >
      {status || "NEW"}
    </span>
  );
}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      className="dashboard-quick-action"
      onClick={onClick}
    >

      <div className="dashboard-quick-action-icon">
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>

      <FiArrowUpRight />

    </button>
  );
}


export default AdminDashboard;
