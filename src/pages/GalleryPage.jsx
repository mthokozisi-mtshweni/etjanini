import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiImage } from "react-icons/fi";
import { Link } from "react-router-dom";

import "./GalleryPage.css";

import {
  optimizeCloudinaryImage,
  getCloudinarySrcSet,
} from "../utils/cloudinary";

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gallery/public`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load gallery."
          );
        }

        setImages(data.images || []);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Unable to load gallery."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        images
          .map((image) => image.category)
          .filter(Boolean)
      ),
    ];
  }, [images]);

  const filteredImages = useMemo(() => {
    if (activeCategory === "ALL") {
      return images;
    }

    return images.filter(
      (image) => image.category === activeCategory
    );
  }, [images, activeCategory]);

  const featuredImages = useMemo(() => {
    return images.filter((image) => image.featured);
  }, [images]);

  return (

    <>
    
    <SEO
  title="Gallery | Etjanini"
  description="Explore moments, food, celebrations and experiences from Etjanini restaurant and events venue in KwaMhlanga."
  path="/gallery"
/>
    <main className="gallery-page">
      {/* HERO */}
      <section className="gallery-hero">
        <div className="gallery-hero-background" />

        <div className="gallery-hero-content">
          <Link to="/" className="gallery-back-link">
            <FiArrowLeft />
            Back to Etjanini
          </Link>

          <span className="gallery-eyebrow">
            THE ETJANINI EXPERIENCE
          </span>

          <h1>
            Moments Worth
            <br />
            <em>Remembering.</em>
          </h1>

          <p>
            Explore the spaces, celebrations, flavours
            and experiences that make Etjanini special.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="gallery-content">
        <div className="gallery-content-heading">
          <div>
            <span className="gallery-section-eyebrow">
              OUR GALLERY
            </span>

            <h2>
              A Glimpse Into
              <br />
              <em>Etjanini.</em>
            </h2>
          </div>

          <p>
            From intimate dining experiences to weddings,
            conferences and unforgettable celebrations,
            discover the atmosphere behind the Etjanini
            experience.
          </p>
        </div>

        {loading && (
          <div className="gallery-state">
            <div className="gallery-state-icon">
              <FiImage />
            </div>

            <h3>Loading gallery...</h3>
          </div>
        )}

        {!loading && error && (
          <div className="gallery-state gallery-state-error">
            <div className="gallery-state-icon">
              <FiImage />
            </div>

            <h3>Unable to load gallery</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          images.length === 0 && (
            <div className="gallery-state">
              <div className="gallery-state-icon">
                <FiImage />
              </div>

              <h3>Gallery coming soon</h3>

              <p>
                We're preparing beautiful images of the
                Etjanini experience.
              </p>
            </div>
          )}

        {!loading && !error && images.length > 0 && (
          <>
            {/* FEATURED */}
            {featuredImages.length > 0 && (
              <section className="gallery-featured">
                <div className="gallery-featured-heading">
                  <span>FEATURED</span>
                  <h3>Highlights From Etjanini</h3>
                </div>

                <div className="gallery-featured-grid">
                  {featuredImages
                    .slice(0, 3)
                    .map((image) => (
                      <article
                        className="gallery-featured-card"
                        key={image.id}
                      >
                        <img
                          src={image.imageUrl}
                          alt={
                            image.title ||
                            "Etjanini experience"
                          }
                        />

                        <div className="gallery-featured-overlay">
                          <div>
                            <span>
                              {image.category}
                            </span>

                            <h3>
                              {image.title ||
                                "Etjanini"}
                            </h3>
                          </div>

                          <FiArrowUpRight />
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            )}

            {/* FILTERS */}
            <div className="gallery-filter-wrapper">
              <div className="gallery-filter-label">
                Explore
              </div>

              <div className="gallery-filters">
                <button
                  className={
                    activeCategory === "ALL"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory("ALL")
                  }
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    className={
                      activeCategory === category
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveCategory(category)
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* GALLERY GRID */}
            {filteredImages.length > 0 ? (
              <div className="gallery-grid">
                {filteredImages.map((image, index) => (
                  <article
                    className={`gallery-card gallery-card-${(
                      index % 6
                    ) + 1}`}
                    key={image.id}
                  >
                    <img
  src={optimizeCloudinaryImage(
    image.imageUrl,
    {
      width: 1200,
      height: 900,
      crop: "fill",
    }
  )}
  srcSet={getCloudinarySrcSet(
    image.imageUrl,
    {
      height: 900,
      crop: "fill",
    }
  )}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={image.title || "Etjanini gallery"}
  loading="lazy"
/>

                    <div className="gallery-card-overlay">
                      <div>
                        <span>
                          {image.category}
                        </span>

                        <h3>
                          {image.title ||
                            "Etjanini"}
                        </h3>

                        {image.description && (
                          <p>
                            {image.description}
                          </p>
                        )}
                      </div>

                      <div className="gallery-card-icon">
                        <FiArrowUpRight />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="gallery-state">
                <div className="gallery-state-icon">
                  <FiImage />
                </div>

                <h3>No images in this category</h3>

                <p>
                  Try selecting another category.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="gallery-cta">
        <span>PLAN YOUR EXPERIENCE</span>

        <h2>
          Your Next
          <br />
          <em>Moment Awaits.</em>
        </h2>

        <p>
          Whether you're planning a wedding, conference,
          celebration or simply looking for great food,
          we'd love to welcome you.
        </p>

        <Link to="/#booking" className="gallery-cta-button">
          Make an Enquiry
          <FiArrowUpRight />
        </Link>
      </section>
    </main>
    </>
  );
}

export default GalleryPage;