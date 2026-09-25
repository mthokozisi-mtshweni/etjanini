import { useState } from "react";
import {
  FiCalendar,
  FiGrid,
  FiImage,
  FiLogOut,
  FiMail,
  FiMenu,
  FiSettings,
  FiX,
  FiStar,
} from "react-icons/fi";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";



import "../admin.css";

function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const admin = JSON.parse(
    localStorage.getItem("etjanini_admin") || "null"
  );

  const logout = () => {
    localStorage.removeItem("etjanini_admin_token");
    localStorage.removeItem("etjanini_admin");

    navigate("/admin/login", {
      replace: true,
    });
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="admin-layout">

      {mobileOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`admin-sidebar ${
          mobileOpen
            ? "admin-sidebar-mobile-open"
            : ""
        }`}
      >

        <div className="admin-sidebar-top">

          <div className="admin-sidebar-brand">
            <span>ETJANINI</span>
            <small>ADMINISTRATION</small>
          </div>

          <button
            className="admin-mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
          >
            <FiX />
          </button>

        </div>

        <nav className="admin-sidebar-nav">

          <span className="admin-nav-label">
            OVERVIEW
          </span>

          <NavLink
            to="/admin/dashboard"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiGrid />
            Dashboard
          </NavLink>

          <span className="admin-nav-label">
            MANAGEMENT
          </span>

          <NavLink
            to="/admin/enquiries"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiMail />
            Enquiries
          </NavLink>

          <NavLink
            to="/admin/menu"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiCalendar />
            Menu
          </NavLink>

          <NavLink
            to="/admin/events"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiCalendar />
            Events
          </NavLink>

          <NavLink
            to="/admin/gallery"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <FiImage />
            Gallery
          </NavLink>

          <NavLink
            to="/admin/reviews"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiStar />
            Reviews
          </NavLink>

          <span className="admin-nav-label">
            SYSTEM
          </span>

          <NavLink
            to="/admin/settings"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiSettings />
            Settings
          </NavLink>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-user">

            <div className="admin-sidebar-avatar">
              {admin?.fullName
                ?.charAt(0)
                .toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {admin?.fullName ||
                  "Administrator"}
              </strong>

              <small>
                {admin?.role || "ADMIN"}
              </small>
            </div>

          </div>

          <button
            className="admin-logout-button"
            onClick={logout}
          >
            <FiLogOut />
            Sign out
          </button>

        </div>

      </aside>

      <div className="admin-layout-content">

        <header className="admin-mobile-header">

          <button
            className="admin-mobile-menu-button"
            onClick={() =>
              setMobileOpen(true)
            }
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <div className="admin-mobile-brand">
            <strong>ETJANINI</strong>
            <span>ADMIN</span>
          </div>

          <button
            className="admin-mobile-profile"
            onClick={() =>
              navigate("/admin/settings")
            }
            aria-label="Open settings"
          >
            {admin?.fullName
              ?.charAt(0)
              .toUpperCase() || "A"}
          </button>

        </header>

        <main className="admin-layout-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;