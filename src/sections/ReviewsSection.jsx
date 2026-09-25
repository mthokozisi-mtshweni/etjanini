import { useEffect, useState } from "react";
import {
  FiStar,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import "./ReviewsSection.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
  name: "",
  rating: 0,
  comment: "",
};

function StarRating({ rating, interactive = false, onChange }) {
  return (
    <div
      className={`reviews-stars ${
        interactive ? "reviews-stars--interactive" : ""
      }`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= rating;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              className={`reviews-star ${
                active ? "reviews-star--active" : ""
              }`}
              onClick={() => onChange(star)}
              aria-label={`Give ${star} star${
                star > 1 ? "s" : ""
              }`}
            >
              <FiStar
                size={20}
                fill={active ? "currentColor" : "none"}
              />
            </button>
          );
        }

        return (
          <FiStar
            key={star}
            className={
              active
                ? "reviews-star-icon reviews-star-icon--active"
                : "reviews-star-icon"
            }
            size={17}
            fill={active ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}

function formatReviewDate(date) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);

      const response = await fetch(
        `${API_URL}/api/reviews/public`
      );

      if (!response.ok) {
        throw new Error("Unable to load reviews.");
      }

      const result = await response.json();

      setReviews(result.reviews || []);
    } catch (error) {
      console.error("Load reviews error:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleRatingChange = (rating) => {
    setForm((current) => ({
      ...current,
      rating,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const name = form.name.trim();
    const comment = form.comment.trim();

    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (name.length < 2) {
      setErrorMessage(
        "Your name must be at least 2 characters."
      );
      return;
    }

    if (!form.rating) {
      setErrorMessage(
        "Please select a rating from 1 to 5 stars."
      );
      return;
    }

    if (!comment) {
      setErrorMessage("Please write a review.");
      return;
    }

    if (comment.length < 10) {
      setErrorMessage(
        "Your review must be at least 10 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            rating: Number(form.rating),
            comment,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit your review."
        );
      }

      setForm(EMPTY_FORM);

      setSuccessMessage(
        "Thank you for your review. It has been submitted for approval."
      );
    } catch (error) {
      console.error("Submit review error:", error);

      setErrorMessage(
        error.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">

        {/* Header */}
        <div className="reviews-header">
          <span className="reviews-eyebrow">
            Guest Experiences
          </span>

          <h2>What Our Guests Say</h2>

          <p>
            Every visit is part of the Etjanini story.
            Share your experience with us.
          </p>
        </div>

        {/* Reviews */}
        <div className="reviews-content">

          <div className="reviews-list">

            {loadingReviews ? (
              <div className="reviews-state">
                <div className="reviews-loader" />
                <p>Loading guest experiences...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="reviews-state reviews-state--empty">
                <FiStar size={28} />

                <h3>Be our first reviewer</h3>

                <p>
                  Share your Etjanini experience with
                  future guests.
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <article
                  className="review-card"
                  key={review.id}
                >
                  <div className="review-card-top">
                    <div>
                      <h3>{review.name}</h3>

                      <span>
                        {formatReviewDate(
                          review.createdAt
                        )}
                      </span>
                    </div>

                    <StarRating
                      rating={review.rating}
                    />
                  </div>

                  <p className="review-comment">
                    “{review.comment}”
                  </p>
                </article>
              ))
            )}

          </div>

          {/* Review form */}
          <div className="review-form-card">

            <div className="review-form-header">
              <span className="review-form-icon">
                <FiStar size={20} />
              </span>

              <div>
                <span className="reviews-eyebrow">
                  Your Experience
                </span>

                <h3>Leave a Review</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="review-field">
                <label htmlFor="review-name">
                  Your name
                </label>

                <input
                  id="review-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  maxLength={100}
                  disabled={submitting}
                />
              </div>

              <div className="review-field">
                <label>
                  Your rating
                </label>

                <StarRating
                  rating={form.rating}
                  interactive
                  onChange={handleRatingChange}
                />

                <span className="rating-hint">
                  {form.rating
                    ? `${form.rating} out of 5 stars`
                    : "Select a rating"}
                </span>
              </div>

              <div className="review-field">
                <label htmlFor="review-comment">
                  Your review
                </label>

                <textarea
                  id="review-comment"
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Tell us about your experience..."
                  rows={5}
                  maxLength={1000}
                  disabled={submitting}
                />

                <span className="character-count">
                  {form.comment.length}/1000
                </span>
              </div>

              {successMessage && (
                <div className="review-message review-message--success">
                  <FiCheckCircle size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="review-message review-message--error">
                  <FiAlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="review-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="review-button-loader" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Review
                    <FiSend size={17} />
                  </>
                )}
              </button>

              <p className="review-note">
                Reviews are checked by our team before
                appearing publicly.
              </p>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;