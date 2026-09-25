import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiLoader,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiMail,
  FiMessageCircle,
  FiGlobe,
} from "react-icons/fi";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api`;

const emptySettings = {
  businessName: "",
  tagline: "",
  phone: "",
  email: "",
  whatsapp: "",
  address: "",
  city: "",
  province: "",
  country: "",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  mapsUrl: "",
  bookingEmail: "",
  mondayHours: "",
  tuesdayHours: "",
  wednesdayHours: "",
  thursdayHours: "",
  fridayHours: "",
  saturdayHours: "",
  sundayHours: "",
  isOpen: true,
};

function AdminSettings() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("etjanini_admin_token");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("etjanini_admin_token");
          localStorage.removeItem("etjanini_admin");
          window.location.href = "/admin/login";
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load settings."
          );
        }

        setSettings({
          ...emptySettings,
          ...data.settings,
        });
      } catch (err) {
        console.error("Load settings error:", err);
        setError(err.message || "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadSettings();
    } else {
      window.location.href = "/admin/login";
    }
  }, [token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.status === 401) {
        localStorage.removeItem("etjanini_admin_token");
        localStorage.removeItem("etjanini_admin");
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save settings."
        );
      }

      setSettings({
        ...emptySettings,
        ...data.settings,
      });

      setMessage("Settings saved successfully.");
    } catch (err) {
      console.error("Save settings error:", err);
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-settings-page">
        <div className="admin-page-loading">
          <FiLoader className="admin-loading-spinner" />
          <span>Loading settings...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-settings-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">
            SYSTEM SETTINGS
          </span>

          <h1>Site Settings</h1>

          <p>
            Manage the business information displayed across the
            Etjanini website.
          </p>
        </div>
      </div>

      {message && (
        <div className="admin-settings-alert success">
          <FiCheckCircle />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="admin-settings-alert error">
          <FiSettings />
          <span>{error}</span>
        </div>
      )}

      <form
        className="admin-settings-form"
        onSubmit={handleSubmit}
      >
        {/* BUSINESS INFORMATION */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <FiGlobe />
            </div>

            <div>
              <h2>Business Information</h2>
              <p>
                Basic information about your restaurant and venue.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">
            <div className="admin-form-group">
              <label htmlFor="businessName">
                Business Name
              </label>

              <input
                id="businessName"
                name="businessName"
                type="text"
                value={settings.businessName}
                onChange={handleChange}
                placeholder="Etjanini"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="tagline">Tagline</label>

              <input
                id="tagline"
                name="tagline"
                type="text"
                value={settings.tagline || ""}
                onChange={handleChange}
                placeholder="Where great food meets unforgettable moments."
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="phone">
                <FiPhone />
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={settings.phone || ""}
                onChange={handleChange}
                placeholder="+27 ..."
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="email">
                <FiMail />
                Business Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={settings.email || ""}
                onChange={handleChange}
                placeholder="info@example.co.za"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="whatsapp">
                <FiMessageCircle />
                WhatsApp
              </label>

              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                value={settings.whatsapp || ""}
                onChange={handleChange}
                placeholder="+27 ..."
              />
            </div>

            <div className="admin-form-group admin-form-group-full">
              <label htmlFor="address">
                <FiMapPin />
                Street / Venue Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={settings.address || ""}
                onChange={handleChange}
                placeholder="Venue address"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="city">City / Town</label>

              <input
                id="city"
                name="city"
                type="text"
                value={settings.city || ""}
                onChange={handleChange}
                placeholder="KwaMhlanga"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="province">Province</label>

              <input
                id="province"
                name="province"
                type="text"
                value={settings.province || ""}
                onChange={handleChange}
                placeholder="Mpumalanga"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="country">Country</label>

              <input
                id="country"
                name="country"
                type="text"
                value={settings.country || ""}
                onChange={handleChange}
                placeholder="South Africa"
              />
            </div>
          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <FiInstagram />
            </div>

            <div>
              <h2>Social Media & Links</h2>
              <p>
                Add links to Etjanini's online profiles and location.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">
            <div className="admin-form-group">
              <label htmlFor="instagramUrl">
                <FiInstagram />
                Instagram URL
              </label>

              <input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={settings.instagramUrl || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="facebookUrl">
                <FiFacebook />
                Facebook URL
              </label>

              <input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={settings.facebookUrl || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="tiktokUrl">
                TikTok URL
              </label>

              <input
                id="tiktokUrl"
                name="tiktokUrl"
                type="url"
                value={settings.tiktokUrl || ""}
                onChange={handleChange}
                placeholder="https://tiktok.com/@..."
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="mapsUrl">
                <FiMapPin />
                Google Maps URL
              </label>

              <input
                id="mapsUrl"
                name="mapsUrl"
                type="url"
                value={settings.mapsUrl || ""}
                onChange={handleChange}
                placeholder="Google Maps location link"
              />
            </div>
          </div>
        </div>

        {/* BOOKING */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <FiMail />
            </div>

            <div>
              <h2>Booking & Enquiries</h2>
              <p>
                Configure where booking and enquiry communication
                should be directed.
              </p>
            </div>
          </div>

          <div className="admin-settings-grid">
            <div className="admin-form-group admin-form-group-full">
              <label htmlFor="bookingEmail">
                <FiMail />
                Booking Email
              </label>

              <input
                id="bookingEmail"
                name="bookingEmail"
                type="email"
                value={settings.bookingEmail || ""}
                onChange={handleChange}
                placeholder="bookings@example.co.za"
              />
            </div>
          </div>
        </div>

        {/* OPENING HOURS */}
        <div className="admin-settings-card">
          <div className="admin-settings-card-header">
            <div className="admin-settings-icon">
              <FiClock />
            </div>

            <div>
              <h2>Opening Hours</h2>
              <p>
                These hours can later be displayed on the public
                website.
              </p>
            </div>
          </div>

          <div className="admin-settings-hours">
            {[
              ["mondayHours", "Monday"],
              ["tuesdayHours", "Tuesday"],
              ["wednesdayHours", "Wednesday"],
              ["thursdayHours", "Thursday"],
              ["fridayHours", "Friday"],
              ["saturdayHours", "Saturday"],
              ["sundayHours", "Sunday"],
            ].map(([field, label]) => (
              <div
                className="admin-settings-hour-row"
                key={field}
              >
                <label htmlFor={field}>{label}</label>

                <input
                  id={field}
                  name={field}
                  type="text"
                  value={settings[field] || ""}
                  onChange={handleChange}
                  placeholder="09:00 – 22:00"
                />
              </div>
            ))}
          </div>

          <label className="admin-settings-toggle">
            <input
              type="checkbox"
              name="isOpen"
              checked={Boolean(settings.isOpen)}
              onChange={handleChange}
            />

            <span className="admin-settings-toggle-track">
              <span />
            </span>

            <span>
              <strong>Business is currently open</strong>
              <small>
                This can be used later to show the current business
                status on the website.
              </small>
            </span>
          </label>
        </div>

        {/* SAVE */}
        <div className="admin-settings-footer">
          <div>
            <strong>Save your changes</strong>
            <span>
              Updated information will be available to the website.
            </span>
          </div>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving}
          >
            {saving ? (
              <>
                <FiLoader className="admin-loading-spinner" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminSettings;