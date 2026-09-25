import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiEye,
  FiFilter,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
  FiSend,
} from "react-icons/fi";

import "../admin.css";

const STATUS_OPTIONS = [
  "ALL",
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [eventFilter, setEventFilter] = useState("ALL");

  const [isLoading, setIsLoading] = useState(true);
const [isUpdating, setIsUpdating] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const [isReplying, setIsReplying] = useState(false);

const [replyMessage, setReplyMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const token = localStorage.getItem(
    "etjanini_admin_token"
  );

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/enquiries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem(
            "etjanini_admin_token"
          );

          localStorage.removeItem(
            "etjanini_admin"
          );

          window.location.href = "/admin/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load enquiries."
          );
        }

        setEnquiries(data.enquiries || []);
      } catch (error) {
        console.error(
          "Fetch enquiries error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load enquiries."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquiries();
  }, [token]);

  const eventTypes = useMemo(() => {
    const uniqueTypes = enquiries
      .map((enquiry) => enquiry.eventType)
      .filter(Boolean)
      .map((type) => type.trim());

    return ["ALL", ...new Set(uniqueTypes)];
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !normalizedSearch ||
        enquiry.fullName
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        enquiry.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        enquiry.phone
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        enquiry.eventType
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        enquiry.status === statusFilter;

      const matchesEvent =
        eventFilter === "ALL" ||
        enquiry.eventType?.toLowerCase() ===
          eventFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEvent
      );
    });
  }, [
    enquiries,
    searchTerm,
    statusFilter,
    eventFilter,
  ]);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const updateStatus = async (
    enquiryId,
    newStatus
  ) => {
    setIsUpdating(true);
    setActionMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enquiries/${enquiryId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "etjanini_admin_token"
        );

        localStorage.removeItem(
          "etjanini_admin"
        );

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update status."
        );
      }

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry.id === enquiryId
            ? {
                ...enquiry,
                status: data.enquiry.status,
                updatedAt:
                  data.enquiry.updatedAt,
              }
            : enquiry
        )
      );

      setSelectedEnquiry((previous) =>
        previous?.id === enquiryId
          ? {
              ...previous,
              status: data.enquiry.status,
              updatedAt:
                data.enquiry.updatedAt,
            }
          : previous
      );

      setActionMessage(
        "Enquiry status updated successfully."
      );
    } catch (error) {
      console.error(
        "Update enquiry status error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to update enquiry status."
      );
    } finally {
      setIsUpdating(false);
    }
  };


  const sendReply = async () => {
  if (!selectedEnquiry) return;

  const message = replyMessage.trim();

  if (!message) {
    setErrorMessage("Please write a message before sending.");
    return;
  }

  if (message.length < 5) {
    setErrorMessage(
      "Your reply must contain at least 5 characters."
    );
    return;
  }

  setIsReplying(true);
  setActionMessage("");
  setErrorMessage("");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/enquiries/${selectedEnquiry.id}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem(
        "etjanini_admin_token"
      );

      localStorage.removeItem(
        "etjanini_admin"
      );

      window.location.href = "/admin/login";

      return;
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to send reply."
      );
    }

    setReplyMessage("");

    setActionMessage(
      `Reply sent successfully to ${selectedEnquiry.email}.`
    );
  } catch (error) {
    console.error(
      "Send enquiry reply error:",
      error
    );

    setErrorMessage(
      error.message ||
        "Unable to send reply."
    );
  } finally {
    setIsReplying(false);
  }
};

  const deleteEnquiry = async (enquiryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this enquiry?"
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setActionMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enquiries/${enquiryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "etjanini_admin_token"
        );

        localStorage.removeItem(
          "etjanini_admin"
        );

        window.location.href =
          "/admin/login";

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete enquiry."
        );
      }

      setEnquiries((previous) =>
        previous.filter(
          (enquiry) =>
            enquiry.id !== enquiryId
        )
      );

      setSelectedEnquiry(null);

      setActionMessage(
        "Enquiry deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete enquiry error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to delete enquiry."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-enquiries-page">

      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>Enquiries</h1>

          <p>
            Manage event and venue enquiries
            received by Etjanini.
          </p>
        </div>

        <div className="admin-page-total">
          <strong>
            {filteredEnquiries.length}
          </strong>

          <span>
            {filteredEnquiries.length === 1
              ? "enquiry"
              : "enquiries"}
          </span>
        </div>
      </div>

      <div className="admin-filter-panel">

        <div className="admin-search">
          <FiSearch />

          <input
            type="search"
            placeholder="Search by name, email, phone or event..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="admin-filter-select">
          <FiFilter />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status === "ALL"
                  ? "All statuses"
                  : status}
              </option>
            ))}
          </select>

          <FiChevronDown />
        </div>

        <div className="admin-filter-select">
          <FiCalendar />

          <select
            value={eventFilter}
            onChange={(event) =>
              setEventFilter(event.target.value)
            }
          >
            {eventTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type === "ALL"
                  ? "All event types"
                  : type}
              </option>
            ))}
          </select>

          <FiChevronDown />
        </div>

      </div>

      {actionMessage && (
        <div className="admin-action-message">
          <FiCheck />
          {actionMessage}
        </div>
      )}

      {errorMessage && (
        <div className="admin-error-message">
          <FiAlertCircle />
          {errorMessage}
        </div>
      )}

      <div className="admin-enquiries-panel">

        {isLoading ? (
          <div className="admin-loading">
            Loading enquiries...
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="admin-empty">
            <FiMail />

            <h3>No enquiries found</h3>

            <p>
              Try changing your search or
              filters.
            </p>
          </div>
        ) : (
          <div className="admin-enquiries-table-wrapper">

            <table className="admin-enquiries-table">

              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredEnquiries.map(
                  (enquiry) => (
                    <tr key={enquiry.id}>

                      <td>
                        <div className="admin-enquiry-guest">
                          <strong>
                            {enquiry.fullName}
                          </strong>

                          <small>
                            {enquiry.email}
                          </small>
                        </div>
                      </td>

                      <td>
                        <span className="admin-event-type">
                          {enquiry.eventType}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          enquiry.eventDate
                        )}
                      </td>

                      <td>
                        {enquiry.guests || "—"}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${enquiry.status.toLowerCase()}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="admin-view-button"
                          onClick={() =>
                            setSelectedEnquiry(
                              enquiry
                            )
                          }
                        >
                          <FiEye />
                          View
                        </button>
                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {selectedEnquiry && (
        <div
          className="admin-detail-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedEnquiry(null);
            }
          }}
        >

          <aside className="admin-detail-drawer">

            <div className="admin-detail-header">

              <div>
                <span className="admin-eyebrow">
                  ENQUIRY #{selectedEnquiry.id}
                </span>

                <h2>
                  Enquiry Details
                </h2>
              </div>

              <button
                className="admin-close-button"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
                aria-label="Close enquiry details"
              >
                <FiX />
              </button>

            </div>

            <div className="admin-detail-body">

              <div className="admin-detail-profile">
                <div className="admin-detail-avatar">
                  {selectedEnquiry.fullName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    {selectedEnquiry.fullName}
                  </h3>

                  <span>
                    {selectedEnquiry.eventType}
                  </span>
                </div>
              </div>

              <div className="admin-detail-status">

                <label>
                  Enquiry status
                </label>

                <div className="admin-status-select">

                  <select
                    value={
                      selectedEnquiry.status
                    }
                    onChange={(event) =>
                      updateStatus(
                        selectedEnquiry.id,
                        event.target.value
                      )
                    }
                    disabled={isUpdating}
                  >
                    {STATUS_OPTIONS
                      .filter(
                        (status) =>
                          status !== "ALL"
                      )
                      .map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                  </select>

                  <FiChevronDown />

                </div>

              </div>

              <div className="admin-detail-grid">

                <div className="admin-detail-item">
                  <FiMail />

                  <div>
                    <span>Email</span>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>
                </div>

                <div className="admin-detail-item">
                  <FiPhone />

                  <div>
                    <span>Phone</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                </div>

                <div className="admin-detail-item">
                  <FiCalendar />

                  <div>
                    <span>Event date</span>
                    <strong>
                      {formatDate(
                        selectedEnquiry.eventDate
                      )}
                    </strong>
                  </div>
                </div>

                <div className="admin-detail-item">
                  <FiUsers />

                  <div>
                    <span>Guests</span>
                    <strong>
                      {selectedEnquiry.guests ||
                        "Not specified"}
                    </strong>
                  </div>
                </div>

              </div>

              <div className="admin-detail-message">

                <span>Customer message</span>

                <p>
                  {selectedEnquiry.message ||
                    "No message was provided."}
                </p>

              </div>

              <div className="admin-enquiry-reply">

  <div className="admin-enquiry-reply-header">
    <div>
      <span>REPLY TO CUSTOMER</span>

      <h3>
        Send a response
      </h3>
    </div>

    <FiMessageCircle />
  </div>

  <div className="admin-enquiry-reply-recipient">
    <FiMail />

    <span>
      {selectedEnquiry.email}
    </span>
  </div>

  <textarea
    value={replyMessage}
    onChange={(event) =>
      setReplyMessage(event.target.value)
    }
    placeholder="Write your response to the customer..."
    rows={6}
    disabled={isReplying}
  />

  <div className="admin-enquiry-reply-footer">

    <span>
      {replyMessage.length} characters
    </span>

    <button
      type="button"
      onClick={sendReply}
      disabled={
        isReplying ||
        !replyMessage.trim()
      }
    >
      <FiSend />

      {isReplying
        ? "Sending..."
        : "Send Reply"}
    </button>

  </div>

</div>

              <div className="admin-detail-meta">

                <div>
                  <span>Received</span>
                  <strong>
                    {formatDateTime(
                      selectedEnquiry.createdAt
                    )}
                  </strong>
                </div>

                <div>
                  <span>Last updated</span>
                  <strong>
                    {formatDateTime(
                      selectedEnquiry.updatedAt
                    )}
                  </strong>
                </div>

              </div>

            </div>

            <div className="admin-detail-footer">

              <button
                className="admin-delete-button"
                onClick={() =>
                  deleteEnquiry(
                    selectedEnquiry.id
                  )
                }
                disabled={isDeleting}
              >
                <FiTrash2 />

                {isDeleting
                  ? "Deleting..."
                  : "Delete enquiry"}
              </button>

            </div>

          </aside>

        </div>
      )}

    </div>
  );
}

export default AdminEnquiries;