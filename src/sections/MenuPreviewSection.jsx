import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCoffee,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/menu`;

function MenuPreviewSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedMenu = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Unable to load menu.");
        }

        const allItems = (data.categories || []).flatMap(
          (category) =>
            (category.items || []).map((item) => ({
              ...item,
              categoryName: category.name,
            }))
        );

        const featured = allItems.filter(
          (item) => item.featured
        );

        const selectedItems =
          featured.length > 0
            ? featured.slice(0, 3)
            : allItems.slice(0, 3);

        setItems(selectedItems);
      } catch (error) {
        console.error(
          "Homepage menu error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMenu();
  }, []);

  return (
    <section className="menu-preview-section">
      <div className="menu-preview-container">

        {/* Heading */}
        <div className="menu-preview-heading">

          <div>
            <span className="section-eyebrow">
              FROM OUR KITCHEN
            </span>

            <h2>
              A Taste of
              <br />
              Etjanini
            </h2>
          </div>

          <div className="menu-preview-intro">
            <p>
              Discover dishes prepared for memorable
              moments, from relaxed dining to special
              celebrations.
            </p>

            <Link
              to="/menu"
              className="menu-preview-link"
            >
              View Full Menu
              <FiArrowRight />
            </Link>
          </div>

        </div>

        {/* Menu */}
        {loading ? (
          <div className="menu-preview-loading">
            <div className="menu-preview-spinner" />
            <p>Loading our menu...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="menu-preview-empty">
            <FiCoffee />

            <h3>Our menu is coming soon.</h3>

            <p>
              We're preparing something special
              for you.
            </p>
          </div>
        ) : (
          <div className="menu-preview-grid">
            {items.map((item) => (
              <article
                key={item.id}
                className="menu-preview-card"
              >
                <div className="menu-preview-image">

                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="menu-preview-placeholder">
                      <FiCoffee />
                    </div>
                  )}

                  {item.featured && (
                    <span className="menu-preview-featured">
                      <FiStar />
                      Featured
                    </span>
                  )}

                </div>

                <div className="menu-preview-card-content">

                  <span className="menu-preview-category">
                    {item.categoryName}
                  </span>

                  <div className="menu-preview-card-top">
                    <h3>{item.name}</h3>

                    <strong>
                      R{Number(item.price).toFixed(2)}
                    </strong>
                  </div>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && items.length > 0 && (
          <div className="menu-preview-bottom">
            <Link
              to="/menu"
              className="menu-preview-all-button"
            >
              Explore Our Full Menu
              <FiArrowRight />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

export default MenuPreviewSection;