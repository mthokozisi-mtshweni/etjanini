import { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiImage,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import ImageUploader from "../components/ImageUploader";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/gallery`;
  
const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  category: "General",
  featured: false,
  isPublished: true,
  sortOrder: 0,
};

function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("etjanini_admin_token");

  const logout = () => {
    localStorage.removeItem("etjanini_admin_token");
    localStorage.removeItem("etjanini_admin");
    window.location.href = "/admin/login";
  };

  const handleUnauthorized = () => {
    logout();
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load gallery."
        );
      }

      setImages(data.images || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        images
          .map((image) => image.category)
          .filter(Boolean)
      ),
    ];

    return unique.sort();
  }, [images]);

  const filteredImages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return images.filter((image) => {
      const matchesSearch =
        !query ||
        image.title?.toLowerCase().includes(query) ||
        image.description?.toLowerCase().includes(query) ||
        image.category?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" ||
        image.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [images, search, categoryFilter]);

  const openCreateModal = () => {
    setEditingImage(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setShowModal(true);
  };

  const openEditModal = (image) => {
    setEditingImage(image);

    setForm({
      title: image.title || "",
      description: image.description || "",
      imageUrl: image.imageUrl || "",
      category: image.category || "General",
      featured: Boolean(image.featured),
      isPublished: Boolean(image.isPublished),
      sortOrder: image.sortOrder ?? 0,
    });

    setError("");
    setMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (actionLoading) return;

    setShowModal(false);
    setEditingImage(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.imageUrl.trim()) {
      setError("Image URL is required.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const isEditing = Boolean(editingImage);

      const response = await fetch(
        isEditing
          ? `${API_URL}/${editingImage.id}`
          : API_URL,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            imageUrl: form.imageUrl,
            category: form.category,
            featured: form.featured,
            isPublished: form.isPublished,
            sortOrder: Number(form.sortOrder) || 0,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save gallery image."
        );
      }

      setMessage(
        isEditing
          ? "Gallery image updated successfully."
          : "Gallery image added successfully."
      );

      setShowModal(false);
      setEditingImage(null);
      setForm(emptyForm);

      await loadImages();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to save gallery image."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const updateImage = async (id, updates) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update image."
        );
      }

      setMessage("Gallery image updated successfully.");
      await loadImages();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update image.");
    } finally {
      setActionLoading(false);
    }
  };

  const togglePublished = (image) => {
    updateImage(image.id, {
      isPublished: !image.isPublished,
    });
  };

  const toggleFeatured = (image) => {
    updateImage(image.id, {
      featured: !image.featured,
    });
  };

  const deleteImage = async (image) => {
    const confirmed = window.confirm(
      `Delete "${image.title || "this gallery image"}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/${image.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete image."
        );
      }

      setMessage("Gallery image deleted successfully.");
      await loadImages();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to delete image.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="admin-gallery-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>Gallery</h1>

          <p>
            Manage the images displayed across the
            Etjanini website.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={openCreateModal}
        >
          <FiPlus />
          Add Image
        </button>
      </div>

      <div className="admin-gallery-toolbar">
        <div className="admin-gallery-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search gallery..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="admin-gallery-filters">
          <button
            className={
              categoryFilter === "ALL"
                ? "active"
                : ""
            }
            onClick={() => setCategoryFilter("ALL")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={
                categoryFilter === category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategoryFilter(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="admin-action-message">
          <FiCheck />
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">
          Loading gallery...
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="admin-gallery-empty">
          <div className="admin-gallery-empty-icon">
            <FiImage />
          </div>

          <h3>
            {images.length === 0
              ? "No gallery images yet"
              : "No matching images"}
          </h3>

          <p>
            {images.length === 0
              ? "Add your first Etjanini gallery image to get started."
              : "Try changing your search or category filter."}
          </p>

          {images.length === 0 && (
            <button
              className="admin-primary-button"
              onClick={openCreateModal}
            >
              <FiPlus />
              Add First Image
            </button>
          )}
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {filteredImages.map((image) => (
            <article
              className="admin-gallery-card"
              key={image.id}
            >
              <div className="admin-gallery-card-image">
                <img
                  src={image.imageUrl}
                  alt={image.title || "Etjanini gallery"}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

                <div className="admin-gallery-card-overlay">
                  <button
                    className="admin-gallery-edit-button"
                    onClick={() =>
                      openEditModal(image)
                    }
                    title="Edit image"
                  >
                    <FiEdit3 />
                  </button>
                </div>

                <div className="admin-gallery-card-badges">
                  {image.featured && (
                    <span className="admin-gallery-badge featured">
                      <FiStar />
                      Featured
                    </span>
                  )}

                  <span
                    className={`admin-gallery-badge ${
                      image.isPublished
                        ? "published"
                        : "draft"
                    }`}
                  >
                    {image.isPublished ? (
                      <>
                        <FiEye />
                        Published
                      </>
                    ) : (
                      <>
                        <FiEyeOff />
                        Hidden
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="admin-gallery-card-body">
                <div className="admin-gallery-card-top">
                  <span className="admin-gallery-category">
                    {image.category}
                  </span>

                  <span className="admin-gallery-order">
                    #{image.sortOrder}
                  </span>
                </div>

                <h3>
                  {image.title || "Untitled image"}
                </h3>

                {image.description && (
                  <p>{image.description}</p>
                )}

                <div className="admin-gallery-card-actions">
                  <button
                    className="admin-icon-button"
                    onClick={() =>
                      togglePublished(image)
                    }
                    disabled={actionLoading}
                    title={
                      image.isPublished
                        ? "Unpublish"
                        : "Publish"
                    }
                  >
                    {image.isPublished ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                  <button
                    className="admin-icon-button"
                    onClick={() =>
                      toggleFeatured(image)
                    }
                    disabled={actionLoading}
                    title={
                      image.featured
                        ? "Remove featured"
                        : "Make featured"
                    }
                  >
                    <FiStar />
                  </button>

                  <button
                    className="admin-icon-button"
                    onClick={() =>
                      openEditModal(image)
                    }
                    disabled={actionLoading}
                    title="Edit"
                  >
                    <FiEdit3 />
                  </button>

                  <button
                    className="admin-icon-button danger"
                    onClick={() =>
                      deleteImage(image)
                    }
                    disabled={actionLoading}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !actionLoading
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-modal admin-modal-large">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">
                  GALLERY MANAGEMENT
                </span>

                <h2>
                  {editingImage
                    ? "Edit Image"
                    : "Add Gallery Image"}
                </h2>
              </div>

              <button
                className="admin-close-button"
                onClick={closeModal}
                disabled={actionLoading}
              >
                <FiX />
              </button>
            </div>

            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >
              {/* <div className="admin-gallery-form-preview">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div>
                    <FiImage />
                    <span>Image preview</span>
                  </div>
                )}
              </div> */}

              <ImageUploader
                value={form.imageUrl}
                onChange={(url) =>
                  setForm((current) => ({
                    ...current,
                    imageUrl: url,
                  }))
                }
                label="Gallery image"

               
              />

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="title">
                    Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Etjanini Wedding Setup"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="category">
                    Category
                  </label>

                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Weddings"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this image..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="sortOrder">
                    Display Order
                  </label>

                  <input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-menu-form-options">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />

                  <span>
                    <FiStar />
                    Featured image
                  </span>
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                  />

                  <span>
                    <FiEye />
                    Publish on website
                  </span>
                </label>
              </div>

              {error && (
                <div className="admin-error-message">
                  {error}
                </div>
              )}

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Saving..."
                    : editingImage
                    ? "Save Changes"
                    : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminGallery;