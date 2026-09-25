import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiLoader,
} from "react-icons/fi";

import "../admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to sign in."
        );
      }

      localStorage.setItem("etjanini_admin_token", data.token);
      localStorage.setItem(
        "etjanini_admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-background">
        <div className="admin-login-orb admin-login-orb-one"></div>
        <div className="admin-login-orb admin-login-orb-two"></div>
      </div>

      <main className="admin-login-container">
        <div className="admin-login-card">

          <div className="admin-login-brand">
            <span className="admin-login-brand-main">
              ETJANINI
            </span>

            <span className="admin-login-brand-sub">
              RESTAURANT • EVENTS • VENUE
            </span>
          </div>

          <div className="admin-login-heading">
            <span className="admin-eyebrow">
              ADMINISTRATION
            </span>

            <h1>
              Welcome <span>Back.</span>
            </h1>

            <p>
              Sign in to manage enquiries and
              venue operations.
            </p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div className="admin-input-wrapper">
                <FiMail />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@etjanini.local"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="admin-input-wrapper">
                <FiLock />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="admin-login-error">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="admin-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <FiArrowRight />
                </>
              )}
            </button>

          </form>

          <div className="admin-login-footer">
            <span>
              Etjanini Administration
            </span>

            <span>
              Secure staff access
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminLogin;