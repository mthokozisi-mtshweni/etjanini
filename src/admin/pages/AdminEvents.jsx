import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiImage,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

import ImageUploader from "../components/ImageUploader";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/events`;

const EMPTY_FORM = {
  title: "",
  description: "",
  eventType: "Wedding",
  eventDate: "",
  endDate: "",
  location: "",
  capacity: "",
  imageUrl: "",
  featured: false,
  isPublished: false,
};

const EVENT_TYPES = [
  "Wedding",
  "Conference",
  "Function",
  "Restaurant",
  "Corporate",
  "Other",
];

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] =
    useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingEvent, setEditingEvent] =
    useState(null);

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const token = localStorage.getItem(
    "etjanini_admin_token"
  );

  const handleUnauthorized = () => {
    localStorage.removeItem(
      "etjanini_admin_token"
    );

    localStorage.removeItem(
      "etjanini_admin"
    );

    window.location.href =
      "/admin/login";
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

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
        "Load events error:",
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

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        event.title
          ?.toLowerCase()
          .includes(searchValue) ||
        event.eventType
          ?.toLowerCase()
          .includes(searchValue) ||
        event.location
          ?.toLowerCase()
          .includes(searchValue);

      const matchesType =
        typeFilter === "ALL" ||
        event.eventType === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" &&
          event.isPublished) ||
        (statusFilter === "DRAFT" &&
          !event.isPublished) ||
        (statusFilter === "FEATURED" &&
          event.featured);

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    events,
    search,
    typeFilter,
    statusFilter,
  ]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
    setActionMessage("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title || "",
      description:
        event.description || "",
      eventType:
        event.eventType || "Wedding",
      eventDate: formatDateTimeForInput(
        event.eventDate
      ),
      endDate: event.endDate
        ? formatDateTimeForInput(
            event.endDate
          )
        : "",
      location: event.location || "",
      capacity:
        event.capacity?.toString() || "",
      imageUrl: event.imageUrl || "",
      featured: Boolean(event.featured),
      isPublished: Boolean(
        event.isPublished
      ),
    });

    setActionMessage("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

//   const generateSlug = () => {
//     const slug = formData.title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-+|-+$/g, "");

//     setFormData((current) => ({
//       ...current,
//       slug,
//     }));
//   };

  const saveEvent = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setActionMessage("");

      if (
        !formData.title.trim() ||
        !formData.eventType ||
        !formData.eventDate
      ) {
        setError(
          "Title, slug, event type and event date are required."
        );
        return;
      }

      const payload = {
        title: formData.title.trim(),
        description:
          formData.description.trim(),
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        endDate: formData.endDate || null,
        location:
          formData.location.trim(),
        capacity:
          formData.capacity
            ? Number(formData.capacity)
            : null,
        imageUrl:
          formData.imageUrl.trim(),
        featured: formData.featured,
        isPublished:
          formData.isPublished,
      };

      const url = editingEvent
        ? `${API_URL}/${editingEvent.id}`
        : API_URL;

      const response = await fetch(url, {
        method: editingEvent
          ? "PATCH"
          : "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to save event."
        );
      }

      setActionMessage(
        editingEvent
          ? "Event updated successfully."
          : "Event created successfully."
      );

      setModalOpen(false);
      setEditingEvent(null);
      setFormData(EMPTY_FORM);

      await loadEvents();
    } catch (err) {
      console.error(
        "Save event error:",
        err
      );

      setError(
        err.message ||
          "Unable to save event."
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (event) => {
    await updateEvent(event, {
      isPublished: !event.isPublished,
    });
  };

  const toggleFeatured = async (event) => {
    await updateEvent(event, {
      featured: !event.featured,
    });
  };

  const updateEvent = async (
    event,
    changes
  ) => {
    try {
      setError("");
      setActionMessage("");

      const response = await fetch(
        `${API_URL}/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(changes),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update event."
        );
      }

      setActionMessage(
        "Event updated successfully."
      );

      await loadEvents();
    } catch (err) {
      console.error(
        "Update event error:",
        err
      );

      setError(
        err.message ||
          "Unable to update event."
      );
    }
  };

  const deleteEvent = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setActionMessage("");

      const response = await fetch(
        `${API_URL}/${event.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete event."
        );
      }

      setActionMessage(
        "Event deleted successfully."
      );

      await loadEvents();
    } catch (err) {
      console.error(
        "Delete event error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete event."
      );
    }
  };

  const publishedCount = events.filter(
    (event) => event.isPublished
  ).length;

  const featuredCount = events.filter(
    (event) => event.featured
  ).length;

  return (
    <section className="admin-events-page">

      {/* HEADER */}
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>Events</h1>

          <p>
            Manage weddings, conferences,
            functions and other Etjanini events.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openCreateModal}
        >
          <FiPlus />
          Create Event
        </button>
      </div>

      {/* STATS */}
      <div className="admin-events-stats">

        <div className="admin-event-stat">
          <div className="admin-event-stat-icon">
            <FiCalendar />
          </div>

          <div>
            <span>Total Events</span>
            <strong>{events.length}</strong>
          </div>
        </div>

        <div className="admin-event-stat">
          <div className="admin-event-stat-icon">
            <FiEye />
          </div>

          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
        </div>

        <div className="admin-event-stat">
          <div className="admin-event-stat-icon">
            <FiStar />
          </div>

          <div>
            <span>Featured</span>
            <strong>{featuredCount}</strong>
          </div>
        </div>

        <div className="admin-event-stat">
          <div className="admin-event-stat-icon">
            <FiUsers />
          </div>

          <div>
            <span>Event Types</span>
            <strong>
              {
                new Set(
                  events.map(
                    (event) =>
                      event.eventType
                  )
                ).size
              }
            </strong>
          </div>
        </div>

      </div>

      {/* ACTION MESSAGE */}
      {actionMessage && (
        <div className="admin-action-message">
          <FiCheck />
          {actionMessage}
        </div>
      )}

      {error && (
        <div className="admin-error-message">
          <FiX />
          {error}
        </div>
      )}

      {/* FILTERS */}
      <div className="admin-events-filter-panel">

        <div className="admin-events-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value
            )
          }
          className="admin-filter-select"
        >
          <option value="ALL">
            All event types
          </option>

          {EVENT_TYPES.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="admin-filter-select"
        >
          <option value="ALL">
            All statuses
          </option>

          <option value="PUBLISHED">
            Published
          </option>

          <option value="DRAFT">
            Draft
          </option>

          <option value="FEATURED">
            Featured
          </option>
        </select>

      </div>

      {/* EVENTS */}
      <div className="admin-events-panel">

        <div className="admin-events-panel-header">
          <div>
            <h2>Event Calendar</h2>

            <span>
              {filteredEvents.length}{" "}
              event
              {filteredEvents.length !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="admin-events-empty">

            <FiCalendar />

            <h3>
              {events.length === 0
                ? "No events yet"
                : "No events found"}
            </h3>

            <p>
              {events.length === 0
                ? "Create your first Etjanini event."
                : "Try changing your search or filters."}
            </p>

            {events.length === 0 && (
              <button
                type="button"
                className="admin-primary-button"
                onClick={
                  openCreateModal
                }
              >
                <FiPlus />
                Create Event
              </button>
            )}

          </div>
        ) : (
          <div className="admin-events-list">
            {filteredEvents.map(
              (event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={
                    openEditModal
                  }
                  onDelete={
                    deleteEvent
                  }
                  onTogglePublished={
                    togglePublished
                  }
                  onToggleFeatured={
                    toggleFeatured
                  }
                />
              )
            )}
          </div>
        )}

      </div>

      {/* MODAL */}
      {modalOpen && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-modal admin-modal-large">

            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">
                  EVENT MANAGEMENT
                </span>

                <h2>
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-close-button"
                onClick={closeModal}
              >
                <FiX />
              </button>
            </div>

            <form
              className="admin-form"
              onSubmit={saveEvent}
            >

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>
                    Event title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Summer Wedding Showcase"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>
                    Event type
                  </label>

                  <select
                    name="eventType"
                    value={
                      formData.eventType
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    {EVENT_TYPES.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </div>

              </div>

             

              <div className="admin-form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the event..."
                  rows="5"
                />
              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>
                    Start date & time
                  </label>

                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={
                      formData.eventDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>
                    End date & time
                  </label>

                  <input
                    type="datetime-local"
                    name="endDate"
                    value={
                      formData.endDate
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Etjanini, KwaMhlanga"
                  />
                </div>

                <div className="admin-form-group">
                  <label>
                    Guest capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="capacity"
                    value={
                      formData.capacity
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="250"
                  />
                </div>

              </div>

              <ImageUploader
  value={formData.imageUrl}
  onChange={(url) =>
    setFormData((current) => ({
      ...current,
      imageUrl: url,
    }))
  }
  label="Event image"
  
/>

              <div className="admin-menu-form-options">

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Featured event
                  </span>
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={
                      formData.isPublished
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Publish event
                  </span>
                </label>

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingEvent
                    ? "Save Changes"
                    : "Create Event"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}

function EventCard({
  event,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}) {
  return (
    <article className="admin-event-card">

      <div className="admin-event-card-image">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
          />
        ) : (
          <div className="admin-event-image-placeholder">
            <FiCalendar />
          </div>
        )}

        {event.featured && (
          <span className="admin-event-featured">
            <FiStar />
            Featured
          </span>
        )}
      </div>

      <div className="admin-event-card-content">

        <div className="admin-event-card-top">
          <div>

            <span className="admin-event-type">
              {event.eventType}
            </span>

            <h3>{event.title}</h3>

          </div>

          <span
            className={`admin-event-status ${
              event.isPublished
                ? "published"
                : "draft"
            }`}
          >
            {event.isPublished
              ? "Published"
              : "Draft"}
          </span>
        </div>

        {event.description && (
          <p className="admin-event-description">
            {event.description}
          </p>
        )}

        <div className="admin-event-meta">

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

        <div className="admin-event-actions">

          <button
            type="button"
            className="admin-icon-action"
            onClick={() =>
              onTogglePublished(event)
            }
            title={
              event.isPublished
                ? "Unpublish"
                : "Publish"
            }
          >
            {event.isPublished ? (
              <FiEyeOff />
            ) : (
              <FiEye />
            )}

            <span>
              {event.isPublished
                ? "Unpublish"
                : "Publish"}
            </span>
          </button>

          <button
            type="button"
            className={`admin-icon-action ${
              event.featured
                ? "active"
                : ""
            }`}
            onClick={() =>
              onToggleFeatured(event)
            }
            title={
              event.featured
                ? "Remove featured"
                : "Feature event"
            }
          >
            <FiStar />

            <span>
              {event.featured
                ? "Featured"
                : "Feature"}
            </span>
          </button>

          <button
            type="button"
            className="admin-icon-action"
            onClick={() =>
              onEdit(event)
            }
          >
            <FiEdit2 />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="admin-icon-action danger"
            onClick={() =>
              onDelete(event)
            }
          >
            <FiTrash2 />
            <span>Delete</span>
          </button>

        </div>

      </div>
    </article>
  );
}

function formatEventDate(date) {
  if (!date) return "Date not set";

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

function formatDateTimeForInput(date) {
  if (!date) return "";

  const value = new Date(date);

  const offset =
    value.getTimezoneOffset();

  const localDate = new Date(
    value.getTime() -
      offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export default AdminEvents;