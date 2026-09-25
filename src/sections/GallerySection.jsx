import { useEffect, useState } from "react";
import { FiArrowUpRight, FiImage } from "react-icons/fi";
import { Link } from "react-router-dom";

import {
  optimizeCloudinaryImage,
  getCloudinarySrcSet,
} from "../utils/cloudinary";

function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
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
      } catch (error) {
        console.error("Gallery loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const displayImages = images.slice(0, 6);

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-section-inner">

        {/* Header */}
        <div className="gallery-section-heading">
          <div>
            <span className="section-eyebrow">
              THE ETJANINI EXPERIENCE
            </span>

            <h2>
              Moments Made
              <br />
              <em>Memorable.</em>
            </h2>
          </div>

          <div className="gallery-section-intro">
            <p>
              Take a glimpse into the spaces, celebrations,
              flavours and experiences that make Etjanini
              more than just a place to gather.
            </p>

            <Link
              to="/gallery"
              className="gallery-section-link"
            >
              View Full Gallery
              <FiArrowUpRight />
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="gallery-section-state">
            <FiImage />
            <span>Loading gallery...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && images.length === 0 && (
          <div className="gallery-section-state">
            <FiImage />

            <span>
              Gallery images will appear here soon.
            </span>
          </div>
        )}

        {/* Gallery */}
        {!loading && displayImages.length > 0 && (
          <div className="gallery-section-grid">
            {displayImages.map((image, index) => (
              <Link
                to="/gallery"
                className={`gallery-section-card gallery-section-card-${(
                  index % 6
                ) + 1}`}
                key={image.id}
              >
                {/* <img
                  src={image.imageUrl}
                  alt={
                    image.title ||
                    "Etjanini experience"
                  }
                /> */}

                <img
  src={optimizeCloudinaryImage(
    image.imageUrl,
    {
      width: 1000,
      height: 750,
      crop: "fill",
    }
  )}
  srcSet={getCloudinarySrcSet(
    image.imageUrl,
    {
      height: 750,
      crop: "fill",
    }
  )}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={image.title || "Etjanini gallery"}
  loading="lazy"
/>

                <div className="gallery-section-overlay">
                  <div>
                    <span>
                      {image.category}
                    </span>

                    <h3>
                      {image.title ||
                        "Etjanini"}
                    </h3>
                  </div>

                  <div className="gallery-section-arrow">
                    <FiArrowUpRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && images.length > 0 && (
          <div className="gallery-section-bottom">
            <Link
              to="/gallery"
              className="gallery-view-all"
            >
              Explore All Moments
              <FiArrowUpRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default GallerySection;