import { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiClock,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

function getAdminToken() {
  return localStorage.getItem("etjanini_admin_token");
}

function formatDate(date) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StarRating({ rating }) {
  return (
    <div className="admin-review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={15}
          className={
            star <= rating
              ? "admin-review-star admin-review-star--active"
              : "admin-review-star"
          }
          fill={star <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("etjanini_admin_token");
        localStorage.removeItem("etjanini_admin");

        window.location.href = "/admin/login";
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load reviews."
        );
      }

      setReviews(result.reviews || []);
    } catch (err) {
      console.error("Load admin reviews error:", err);

      setError(
        err.message || "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        review.status === statusFilter;

      const matchesSearch =
        !query ||
        review.name.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [reviews, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: reviews.length,
      pending: reviews.filter(
        (review) => review.status === "PENDING"
      ).length,
      approved: reviews.filter(
        (review) => review.status === "APPROVED"
      ).length,
      rejected: reviews.filter(
        (review) => review.status === "REJECTED"
      ).length,
    };
  }, [reviews]);

  const updateStatus = async (id, status) => {
    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      const token = getAdminToken();

      const response = await fetch(
        `${API_URL}/api/reviews/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "etjanini_admin_token"
        );
        localStorage.removeItem("etjanini_admin");

        window.location.href = "/admin/login";
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update review."
        );
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === id
            ? {
                ...review,
                status: result.review.status,
              }
            : review
        )
      );

      setSuccess(
        `Review ${status.toLowerCase()} successfully.`
      );
    } catch (err) {
      console.error(
        "Update review status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update review."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const deleteReview = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      const token = getAdminToken();

      const response = await fetch(
        `${API_URL}/api/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "etjanini_admin_token"
        );
        localStorage.removeItem("etjanini_admin");

        window.location.href = "/admin/login";
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to delete review."
        );
      }

      setReviews((current) =>
        current.filter((review) => review.id !== id)
      );

      setSuccess("Review deleted successfully.");
    } catch (err) {
      console.error("Delete review error:", err);

      setError(
        err.message ||
          "Unable to delete review."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="admin-reviews-page">

      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">
            Customer Feedback
          </span>

          <h1>Reviews</h1>

          <p>
            Review and moderate guest feedback before
            it appears publicly.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={loadReviews}
          disabled={loading}
        >
          <FiRefreshCw
            className={loading ? "admin-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="admin-review-stats">

        <div className="admin-review-stat">
          <span className="admin-review-stat-icon">
            <FiStar />
          </span>

          <div>
            <strong>{counts.total}</strong>
            <span>Total Reviews</span>
          </div>
        </div>

        <div className="admin-review-stat">
          <span className="admin-review-stat-icon">
            <FiClock />
          </span>

          <div>
            <strong>{counts.pending}</strong>
            <span>Pending</span>
          </div>
        </div>

        <div className="admin-review-stat">
          <span className="admin-review-stat-icon">
            <FiCheck />
          </span>

          <div>
            <strong>{counts.approved}</strong>
            <span>Approved</span>
          </div>
        </div>

        <div className="admin-review-stat">
          <span className="admin-review-stat-icon">
            <FiX />
          </span>

          <div>
            <strong>{counts.rejected}</strong>
            <span>Rejected</span>
          </div>
        </div>

      </div>

      {success && (
        <div className="admin-alert admin-alert--success">
          <FiCheck />
          {success}
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert--error">
          <FiX />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="admin-review-toolbar">

        <div className="admin-review-search">
          <FiSearch />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search reviews..."
          />
        </div>

        <div className="admin-review-filter">
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
                  ? "All reviews"
                  : status}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Review list */}
      <div className="admin-reviews-list">

        {loading ? (
          <div className="admin-review-empty">
            <div className="admin-review-loader" />
            <p>Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="admin-review-empty">
            <FiStar size={30} />

            <h3>No reviews found</h3>

            <p>
              There are no reviews matching your
              current filters.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <article
              className="admin-review-card"
              key={review.id}
            >
              <div className="admin-review-main">

                <div className="admin-review-card-header">

                  <div>
                    <h3>{review.name}</h3>

                    <span>
                      Submitted{" "}
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`admin-review-status admin-review-status--${review.status.toLowerCase()}`}
                  >
                    {review.status}
                  </span>

                </div>

                <StarRating
                  rating={review.rating}
                />

                <p className="admin-review-comment">
                  “{review.comment}”
                </p>

              </div>

              <div className="admin-review-actions">

                {review.status !== "APPROVED" && (
                  <button
                    type="button"
                    className="admin-review-action admin-review-action--approve"
                    onClick={() =>
                      updateStatus(
                        review.id,
                        "APPROVED"
                      )
                    }
                    disabled={
                      processingId === review.id
                    }
                  >
                    <FiCheck />
                    Approve
                  </button>
                )}

                {review.status !== "REJECTED" && (
                  <button
                    type="button"
                    className="admin-review-action admin-review-action--reject"
                    onClick={() =>
                      updateStatus(
                        review.id,
                        "REJECTED"
                      )
                    }
                    disabled={
                      processingId === review.id
                    }
                  >
                    <FiX />
                    Reject
                  </button>
                )}

                <button
                  type="button"
                  className="admin-review-action admin-review-action--delete"
                  onClick={() =>
                    deleteReview(review.id)
                  }
                  disabled={
                    processingId === review.id
                  }
                >
                  <FiTrash2 />
                  Delete
                </button>

              </div>
            </article>
          ))
        )}

      </div>
    </div>
  );
}

export default AdminReviews;