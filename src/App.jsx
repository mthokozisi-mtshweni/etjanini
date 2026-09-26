
import { useState } from "react";

import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";

import "./App.css";

/* =========================
   PUBLIC SECTIONS
========================= */
import AboutSection from "./sections/AboutSection";
import ServicesSection from "./sections/ServicesSection";
import MenuPreviewSection from "./sections/MenuPreviewSection";
import GallerySection from "./sections/GallerySection";
import EventsSection from "./sections/EventsSection";
import BookingSection from "./sections/BookingSection";
import ContactSection from "./sections/ContactSection";
import ReviewsSection from "./sections/ReviewsSection";

/* =========================
   ADMIN PAGES
========================= */
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminEnquiries from "./admin/pages/AdminEnquiries";
import AdminMenu from "./admin/pages/AdminMenu";
import AdminEvents from "./admin/pages/AdminEvents";
import AdminGallery from "./admin/pages/AdminGallery";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminReviews from "./admin/pages/AdminReviews";

/* =========================
   ADMIN LAYOUT
========================= */
import AdminLayout from "./admin/layout/AdminLayout";

/* =========================
   PUBLIC PAGES
========================= */
import MenuPage from "./pages/MenuPage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";

/* =========================
   PUBLIC COMPONENTS
========================= */
import Footer from "./components/Footer";
import RestaurantSchema from "./components/RestaurantSchema";

/* =========================
   SITE SETTINGS CONTEXT
========================= */
import {
  SiteSettingsProvider,
  useSiteSettings,
} from "./context/SiteSettingsContext";

/* =========================
   ROUTER
========================= */
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


/* =========================================================
   PUBLIC WEBSITE
========================================================= */

function PublicWebsite() {
  const { settings, loading } = useSiteSettings();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================
     FALLBACK BUSINESS DATA
  ========================== */

  const businessName =
    settings?.businessName || "ETJANINI";

  const tagline =
    settings?.tagline ||
    "Experience exceptional hospitality, delicious cuisine and memorable occasions at Etjanini in KwaMhlanga.";

  const location = [
    settings?.city,
    settings?.province,
    settings?.country,
  ]
    .filter(Boolean)
    .join(" • ");

  return (

    
    <div className="etjanini-app">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header className="navbar">

        <div className="nav-container">

          {/* BRAND */}

          {/* <a
            href="#home"
            className="brand"
            onClick={closeMenu}
          >
            <span className="brand-main">
              {businessName}
            </span>

            <span className="brand-sub">
              RESTAURANT • EVENTS • VENUE
            </span>
          </a> */}


<a
  href="#home"
  className="brand"
  onClick={closeMenu}
>
  <img
    src="/logo2.webp"
    alt={businessName}
    className="brand-logo"
  />

  <div className="brand-text">
    <span className="brand-main">
      {businessName}
    </span>

    <span className="brand-sub">
      RESTAURANT • EVENTS • VENUE
    </span>
  </div>
</a>

          {/* NAVIGATION LINKS */}

          <nav
            className={`nav-menu ${
              menuOpen
                ? "nav-menu-open"
                : ""
            }`}
          >

            <a
              href="#home"
              onClick={closeMenu}
            >
              Home
            </a>

            <a
              href="#about"
              onClick={closeMenu}
            >
              About
            </a>

            <a
              href="#services"
              onClick={closeMenu}
            >
              Services
            </a>

            <a
              href="#menu"
              onClick={closeMenu}
            >
              Menu
            </a>

            <a
              href="#gallery"
              onClick={closeMenu}
            >
              Gallery
            </a>

            <a
              href="#events"
              onClick={closeMenu}
            >
              Events
            </a>

            <a
              href="#contact"
              onClick={closeMenu}
            >
              Contact
            </a>

            <a
              href="#booking"
              className="nav-cta"
              onClick={closeMenu}
            >
              Book / Enquire
            </a>

          </nav>


          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <FiX />
            ) : (
              <FiMenu />
            )}
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN WEBSITE
      ====================================================== */}

      <main>

        {/* ===================================================
            HERO
        ==================================================== */}

        <section
          id="home"
          className="hero"
        >

          <div className="hero-overlay"></div>


          <div className="hero-content">

            {/* EYEBROW */}

            <span className="hero-eyebrow">
              RESTAURANT • WEDDINGS • CONFERENCES • FUNCTIONS
            </span>


            {/* TITLE */}

            <h1>
              Where Great Food
              <span>
                {" "}
                Meets Unforgettable Moments.
              </span>
            </h1>


            {/* DESCRIPTION */}

            <p>
              {loading
                ? "Experience exceptional hospitality, delicious cuisine and memorable occasions at Etjanini in KwaMhlanga."
                : tagline}
            </p>


            {/* HERO ACTIONS */}

            <div className="hero-actions">

              <a
                href="#menu"
                className="btn btn-primary"
              >
                Explore Our Menu

                <FiArrowRight />
              </a>


              <a
                href="#booking"
                className="btn btn-secondary"
              >
                <FiCalendar />

                Book an Event
              </a>

            </div>


            {/* LOCATION */}

            <div className="hero-location">

              <span className="location-line"></span>

              {location ||
                "KwaMhlanga • Mpumalanga • South Africa"}

              <span className="location-line"></span>

            </div>

          </div>


          {/* SCROLL INDICATOR */}

          <a
            href="#about"
            className="scroll-indicator"
          >

            <span>
              SCROLL TO EXPLORE
            </span>

            <span className="scroll-line"></span>

          </a>

        </section>


        {/* ===================================================
            ABOUT
        ==================================================== */}

        <AboutSection />


        {/* ===================================================
            SERVICES
        ==================================================== */}

        <ServicesSection />


        {/* ===================================================
            MENU PREVIEW
        ==================================================== */}

        <MenuPreviewSection />


        {/* ===================================================
            GALLERY
        ==================================================== */}

        <GallerySection />


        {/* ===================================================
            EVENTS
        ==================================================== */}

        <EventsSection />

        {/* ===================================================
            REVIEWS
        ==================================================== */}

        <ReviewsSection />  

        {/* ===================================================
            BOOKING
        ==================================================== */}

        <BookingSection />


        {/* ===================================================
            CONTACT
        ==================================================== */}

        <ContactSection />

        {/* ===================================================
            FOOTER
        ==================================================== */}


        <Footer />

      </main>

    </div>
  );
}


/* =========================================================
   MAIN APPLICATION
========================================================= */

function App() {

  return (
    <>
      <RestaurantSchema />

    <BrowserRouter>

      {/* ===================================================
          SITE SETTINGS PROVIDER

          Everything inside this provider can access:
          useSiteSettings()
      ==================================================== */}

      <SiteSettingsProvider>

        <Routes>

          {/* =================================================
              PUBLIC HOME
          ================================================== */}

          <Route
            path="/"
            element={
              <PublicWebsite />
            }
          />


          {/* =================================================
              PUBLIC MENU
          ================================================== */}

          <Route
            path="/menu"
            element={
              <MenuPage />
            }
          />


          {/* =================================================
              PUBLIC EVENTS
          ================================================== */}

          <Route
            path="/events"
            element={
              <EventsPage />
            }
          />


          {/* =================================================
              PUBLIC GALLERY
          ================================================== */}

          <Route
            path="/gallery"
            element={
              <GalleryPage />
            }
          />


          {/* =================================================
              ADMIN LOGIN
          ================================================== */}

          <Route
            path="/admin/login"
            element={
              <AdminLogin />
            }
          />


          {/* =================================================
              ADMIN AREA
          ================================================== */}

          <Route
            path="/admin"
            element={
              <AdminLayout />
            }
          >

            {/* DASHBOARD */}

            <Route
              path="dashboard"
              element={
                <AdminDashboard />
              }
            />


            {/* ENQUIRIES */}

            <Route
              path="enquiries"
              element={
                <AdminEnquiries />
              }
            />


            {/* MENU */}

            <Route
              path="menu"
              element={
                <AdminMenu />
              }
            />


            {/* EVENTS */}

            <Route
              path="events"
              element={
                <AdminEvents />
              }
            />


            {/* GALLERY */}

            <Route
              path="gallery"
              element={
                <AdminGallery />
              }
            />

            <Route
              path="/admin/reviews"
              element={<AdminReviews />}
            />


            {/* SETTINGS */}

            <Route
              path="settings"
              element={
                <AdminSettings />
              }
            />

          </Route>

        </Routes>

      </SiteSettingsProvider>

    </BrowserRouter>

    </>
  );
}


export default App;
