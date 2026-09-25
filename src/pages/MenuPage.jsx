import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCoffee,
  FiGrid,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";

import "./MenuPage.css";

import {
  optimizeCloudinaryImage,
  getCloudinarySrcSet,
} from "../utils/cloudinary";

const API_URL = `${import.meta.env.VITE_API_URL}/api/menu`;

function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load menu."
        );
      }

      setCategories(data.categories || []);
    } catch (err) {
      console.error("Menu loading error:", err);
      setError(
        err.message || "Unable to load the menu."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const allItems = useMemo(() => {
    return categories.flatMap((category) =>
      (category.items || []).map((item) => ({
        ...item,
        categoryName: category.name,
        categorySlug: category.slug,
      }))
    );
  }, [categories]);

  const featuredItems = useMemo(() => {
    return allItems.filter((item) => item.featured);
  }, [allItems]);

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") {
      return allItems;
    }

    return allItems.filter(
      (item) => item.categorySlug === activeCategory
    );
  }, [allItems, activeCategory]);

  return (
  <>
    <SEO
      title="Menu | Etjanini Restaurant"
      description="Explore the Etjanini restaurant menu, featuring delicious dishes, grills, sides, desserts and drinks in KwaMhlanga, Mpumalanga."
      path="/menu"
    />

    <main className="menu-page">
      {/* Hero */}
      <section className="menu-page-hero">
        <div className="menu-page-hero-overlay" />

        <div className="menu-page-hero-content">
          <span className="menu-eyebrow">
            ETJANINI
          </span>

          <h1>Our Menu</h1>

          <p>
            Discover thoughtfully prepared dishes,
            refreshing drinks and memorable flavours.
          </p>

          <Link
            to="/"
            className="menu-back-link"
          >
            <FiArrowLeft />
            Back to Etjanini
          </Link>
        </div>
      </section>

      {/* Main content */}
      <section className="menu-page-content">
        {loading ? (
          <div className="menu-state">
            <div className="menu-spinner" />
            <h2>Loading our menu...</h2>
            <p>
              Please wait while we prepare the menu
              for you.
            </p>
          </div>
        ) : error ? (
          <div className="menu-state menu-state-error">
            <FiRefreshCw />

            <h2>We couldn't load the menu</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={loadMenu}
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="menu-state">
            <FiCoffee />

            <h2>Menu coming soon</h2>

            <p>
              Our team is currently preparing the
              Etjanini menu.
            </p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featuredItems.length > 0 && (
              <section className="menu-featured-section">
                <div className="menu-section-heading">
                  <span>CHEF'S SELECTION</span>
                  <h2>Featured Favourites</h2>
                  <p>
                    A selection of dishes we'd love
                    you to discover.
                  </p>
                </div>

                <div className="menu-featured-grid">
                  {featuredItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Category navigation */}
            <section className="menu-browse-section">
              <div className="menu-section-heading">
                <span>EXPLORE</span>
                <h2>Our Menu</h2>
                <p>
                  Browse our selection by category.
                </p>
              </div>

              <div className="menu-category-tabs">
                <button
                  type="button"
                  className={
                    activeCategory === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory("all")
                  }
                >
                  <FiGrid />
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={
                      activeCategory === category.slug
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveCategory(category.slug)
                    }
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {visibleItems.length > 0 ? (
                <div className="menu-items-grid">
                  {visibleItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              ) : (
                <div className="menu-empty-category">
                  <FiCoffee />

                  <h3>
                    No items in this category yet
                  </h3>

                  <p>
                    Please check back soon.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </section>

      {/* Footer CTA */}
      <section className="menu-page-cta">
        <div>
          <span>PLAN YOUR VISIT</span>

          <h2>
            Make your next moment
            <br />
            an Etjanini moment.
          </h2>
        </div>

        <Link
          to="/#booking"
          className="menu-cta-button"
        >
          Book / Enquire
        </Link>
      </section>
    </main>
    </>
  );
}

function MenuCard({ item, featured = false }) {
  return (
    <article
      className={`menu-card ${
        featured ? "menu-card-featured" : ""
      }`}
    >
      <div className="menu-card-image">
        {item.imageUrl ? (
          <img
  src={optimizeCloudinaryImage(
    item.imageUrl,
    {
      width: 900,
      height: 650,
      crop: "fill",
    }
  )}
  srcSet={getCloudinarySrcSet(
    item.imageUrl,
    {
      height: 650,
      crop: "fill",
    }
  )}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
  alt={item.name}
  loading="lazy"
/>
        ) : (
          <div className="menu-card-image-placeholder">
            <FiCoffee />
          </div>
        )}

        {item.featured && (
          <span className="menu-featured-badge">
            <FiStar />
            Featured
          </span>
        )}
      </div>

      <div className="menu-card-body">
        <div className="menu-card-heading">
          <div>
            <span className="menu-card-category">
              {item.categoryName}
            </span>

            <h3>{item.name}</h3>
          </div>

          <strong>
            R{Number(item.price).toFixed(2)}
          </strong>
        </div>

        {item.description && (
          <p>{item.description}</p>
        )}
      </div>
    </article>
  );
}

export default MenuPage;