import { useEffect, useState } from "react";
import {
  FiCheck,
  FiEdit2,
  FiImage,
  FiPlus,
  FiStar,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import ImageUploader from "../components/ImageUploader";

import "../admin.css";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/menu`;

const emptyItemForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  imageUrl: "",
  featured: false,
  isAvailable: true,
  sortOrder: 0,
};

function AdminMenu() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [showCategoryForm, setShowCategoryForm] =
    useState(false);

  const [showItemForm, setShowItemForm] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    sortOrder: 0,
  });

  const [itemForm, setItemForm] =
    useState(emptyItemForm);

  const getToken = () => {
    return localStorage.getItem(
      "etjanini_admin_token"
    );
  };

  const handleUnauthorized = () => {
    localStorage.removeItem(
      "etjanini_admin_token"
    );

    localStorage.removeItem(
      "etjanini_admin"
    );

    window.location.href = "/admin/login";
  };

  const loadCategories = async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load menu categories."
        );
      }

      const loadedCategories =
        data.categories || [];

      setCategories(loadedCategories);

      if (loadedCategories.length === 0) {
        setSelectedCategory(null);
        return;
      }

      const selectedStillExists =
        loadedCategories.some(
          (category) =>
            category.id === selectedCategory
        );

      if (!selectedStillExists) {
        setSelectedCategory(
          loadedCategories[0].id
        );
      }
    } catch (error) {
      console.error(
        "Load menu categories error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to load menu categories."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const activeCategory = categories.find(
    (category) =>
      category.id === selectedCategory
  );

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;

    setCategoryForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleItemChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setItemForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const createCategory = async (event) => {
    event.preventDefault();

    const token = getToken();

    try {
      setErrorMessage("");
      setActionMessage("");

      const response = await fetch(
        `${API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: categoryForm.name,
            slug:
              categoryForm.slug ||
              categoryForm.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-"),
            sortOrder: Number(
              categoryForm.sortOrder
            ),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create category."
        );
      }

      setActionMessage(
        "Category created successfully."
      );

      setCategoryForm({
        name: "",
        slug: "",
        sortOrder: 0,
      });

      setShowCategoryForm(false);

      await loadCategories();

      if (data.category?.id) {
        setSelectedCategory(
          data.category.id
        );
      }
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to create category."
      );
    }
  };

  const openCreateItem = () => {
    setEditingItem(null);

    setItemForm({
      ...emptyItemForm,
      categoryId:
        activeCategory?.id ||
        categories[0]?.id ||
        "",
    });

    setShowItemForm(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);

    setItemForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      categoryId:
        item.categoryId ||
        item.category?.id ||
        "",
      imageUrl: item.imageUrl || "",
      featured: Boolean(item.featured),
      isAvailable: Boolean(item.isAvailable),
      sortOrder: item.sortOrder || 0,
    });

    setShowItemForm(true);
  };

  const closeItemForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
    setItemForm(emptyItemForm);
  };

  const saveItem = async (event) => {
    event.preventDefault();

    const token = getToken();

    try {
      setErrorMessage("");
      setActionMessage("");

      const isEditing = Boolean(editingItem);

      const url = isEditing
        ? `${API_URL}/items/${editingItem.id}`
        : `${API_URL}/items`;

      const response = await fetch(url, {
        method: isEditing
          ? "PATCH"
          : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...itemForm,
          categoryId: Number(
            itemForm.categoryId
          ),
          price: Number(itemForm.price),
          sortOrder: Number(
            itemForm.sortOrder
          ),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save menu item."
        );
      }

      setActionMessage(
        isEditing
          ? "Menu item updated successfully."
          : "Menu item created successfully."
      );

      closeItemForm();

      await loadCategories();

      setSelectedCategory(
        Number(itemForm.categoryId)
      );
    } catch (error) {
      console.error(
        "Save menu item error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to save menu item."
      );
    }
  };

  const toggleAvailability = async (item) => {
    const token = getToken();

    try {
      setErrorMessage("");
      setActionMessage("");

      const response = await fetch(
        `${API_URL}/items/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isAvailable:
              !item.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update availability."
        );
      }

      setActionMessage(
        item.isAvailable
          ? `${item.name} is now unavailable.`
          : `${item.name} is now available.`
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Toggle availability error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to update item."
      );
    }
  };

  const deleteItem = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.name}" from the menu?`
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    try {
      setErrorMessage("");
      setActionMessage("");

      const response = await fetch(
        `${API_URL}/items/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete menu item."
        );
      }

      setActionMessage(
        "Menu item deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete menu item error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to delete menu item."
      );
    }
  };

  const deleteCategory = async () => {
    if (!activeCategory) {
      return;
    }

    const itemCount =
      activeCategory.items?.length ||
      activeCategory._count?.items ||
      0;

    const warning =
      itemCount > 0
        ? `This category contains ${itemCount} menu item(s). Deleting it will also delete those items. Continue?`
        : `Delete "${activeCategory.name}"?`;

    const confirmed =
      window.confirm(warning);

    if (!confirmed) {
      return;
    }

    const token = getToken();

    try {
      setErrorMessage("");
      setActionMessage("");

      const response = await fetch(
        `${API_URL}/categories/${activeCategory.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete category."
        );
      }

      setActionMessage(
        "Category deleted successfully."
      );

      setSelectedCategory(null);

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to delete category."
      );
    }
  };

  return (
    <div className="admin-menu-page">

      {/* PAGE HEADER */}

      <div className="admin-page-heading">

        <div>
          <span className="admin-eyebrow">
            MENU MANAGEMENT
          </span>

          <h1>
            Digital Menu
          </h1>

          <p>
            Manage Etjanini's food and beverage
            menu from one place.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={openCreateItem}
          disabled={
            categories.length === 0
          }
        >
          <FiPlus />
          Add Menu Item
        </button>

      </div>

      {/* MESSAGES */}

      {actionMessage && (
        <div className="admin-action-message">
          <FiCheck />
          {actionMessage}
        </div>
      )}

      {errorMessage && (
        <div className="admin-error-message">
          {errorMessage}
        </div>
      )}

      {/* CATEGORY TOOLBAR */}

      <div className="admin-menu-toolbar">

        <div>
          <span className="admin-eyebrow">
            CATEGORIES
          </span>

          <h2>
            Menu Sections
          </h2>
        </div>

        <button
          className="admin-secondary-button"
          onClick={() =>
            setShowCategoryForm(true)
          }
        >
          <FiPlus />
          Add Category
        </button>

      </div>

      {/* LOADING */}

      {isLoading ? (
        <div className="admin-loading">
          Loading menu...
        </div>
      ) : categories.length === 0 ? (

        /* EMPTY */

        <div className="admin-menu-empty">

          <div className="admin-menu-empty-icon">
            <FiImage />
          </div>

          <h2>
            No menu categories yet
          </h2>

          <p>
            Create your first category to start
            building the Etjanini digital menu.
          </p>

          <button
            className="admin-primary-button"
            onClick={() =>
              setShowCategoryForm(true)
            }
          >
            <FiPlus />
            Create First Category
          </button>

        </div>

      ) : (

        <>
          {/* CATEGORY TABS */}

          <div className="admin-menu-categories">

            {categories.map((category) => (
              <button
                key={category.id}
                className={`admin-menu-category ${
                  selectedCategory === category.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    category.id
                  )
                }
              >
                <span>
                  {category.name}
                </span>

                <small>
                  {category.items?.length ??
                    category._count?.items ??
                    0}{" "}
                  items
                </small>
              </button>
            ))}

          </div>

          {/* ACTIVE CATEGORY */}

          {activeCategory && (

            <section className="admin-menu-items-panel">

              <div className="admin-panel-heading">

                <div>
                  <span className="admin-eyebrow">
                    {activeCategory.name.toUpperCase()}
                  </span>

                  <h2>
                    Menu Items
                  </h2>
                </div>

                <div className="admin-menu-category-actions">

                  <span className="admin-panel-count">
                    {activeCategory.items?.length ||
                      activeCategory._count?.items ||
                      0}{" "}
                    items
                  </span>

                  <button
                    className="admin-secondary-button"
                    onClick={openCreateItem}
                  >
                    <FiPlus />
                    Add Item
                  </button>

                  <button
                    className="admin-danger-button"
                    onClick={deleteCategory}
                  >
                    <FiTrash2 />
                    Delete Category
                  </button>

                </div>

              </div>

              {/* ITEMS */}

              {activeCategory.items?.length >
              0 ? (

                <div className="admin-menu-item-list">

                  {activeCategory.items.map(
                    (item) => (

                      <article
                        className={`admin-menu-item-card ${
                          !item.isAvailable
                            ? "unavailable"
                            : ""
                        }`}
                        key={item.id}
                      >

                        <div className="admin-menu-item-image">

                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                            />
                          ) : (
                            <FiImage />
                          )}

                        </div>

                        <div className="admin-menu-item-content">

                          <div className="admin-menu-item-title">

                            <div>

                              <h3>
                                {item.name}
                              </h3>

                              {item.featured && (
                                <span className="admin-featured-badge">
                                  <FiStar />
                                  Featured
                                </span>
                              )}

                            </div>

                            <strong>
                              R{" "}
                              {Number(
                                item.price
                              ).toFixed(2)}
                            </strong>

                          </div>

                          {item.description && (
                            <p>
                              {item.description}
                            </p>
                          )}

                          <div className="admin-menu-item-footer">

                            <button
                              className={`admin-availability-button ${
                                item.isAvailable
                                  ? "available"
                                  : "unavailable"
                              }`}
                              onClick={() =>
                                toggleAvailability(
                                  item
                                )
                              }
                            >
                              {item.isAvailable ? (
                                <>
                                  <FiCheck />
                                  Available
                                </>
                              ) : (
                                <>
                                  <FiX />
                                  Unavailable
                                </>
                              )}
                            </button>

                            <div className="admin-menu-item-actions">

                              <button
                                className="admin-icon-button"
                                onClick={() =>
                                  openEditItem(
                                    item
                                  )
                                }
                                title="Edit item"
                              >
                                <FiEdit2 />
                              </button>

                              <button
                                className="admin-icon-button admin-icon-danger"
                                onClick={() =>
                                  deleteItem(
                                    item
                                  )
                                }
                                title="Delete item"
                              >
                                <FiTrash2 />
                              </button>

                            </div>

                          </div>

                        </div>

                      </article>

                    )
                  )}

                </div>

              ) : (

                <div className="admin-menu-no-items">

                  <FiImage />

                  <h3>
                    No items in this category
                  </h3>

                  <p>
                    Add the first menu item to
                    this section.
                  </p>

                  <button
                    className="admin-secondary-button"
                    onClick={openCreateItem}
                  >
                    <FiPlus />
                    Add Item
                  </button>

                </div>

              )}

            </section>

          )}

        </>
      )}

      {/* CATEGORY MODAL */}

      {showCategoryForm && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-eyebrow">
                  MENU
                </span>

                <h2>
                  Add Category
                </h2>
              </div>

              <button
                className="admin-close-button"
                onClick={() =>
                  setShowCategoryForm(false)
                }
              >
                <FiX />
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={createCategory}
            >

              <div className="admin-form-group">

                <label>
                  Category name
                </label>

                <input
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryChange}
                  placeholder="e.g. Starters"
                  required
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Slug
                </label>

                <input
                  name="slug"
                  value={categoryForm.slug}
                  onChange={handleCategoryChange}
                  placeholder="starters"
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Display order
                </label>

                <input
                  name="sortOrder"
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={handleCategoryChange}
                  min="0"
                />

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() =>
                    setShowCategoryForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  <FiCheck />
                  Create Category
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ITEM MODAL */}

      {showItemForm && (

        <div className="admin-modal-overlay">

          <div className="admin-modal admin-modal-large">

            <div className="admin-modal-header">

              <div>
                <span className="admin-eyebrow">
                  MENU ITEM
                </span>

                <h2>
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
                </h2>
              </div>

              <button
                className="admin-close-button"
                onClick={closeItemForm}
              >
                <FiX />
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={saveItem}
            >

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Item name
                  </label>

                  <input
                    name="name"
                    value={itemForm.name}
                    onChange={handleItemChange}
                    placeholder="e.g. Signature Grill"
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="categoryId"
                    value={itemForm.categoryId}
                    onChange={handleItemChange}
                    required
                  >

                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="admin-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={itemForm.description}
                  onChange={handleItemChange}
                  placeholder="Describe the dish..."
                  rows="4"
                />

              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Price (R)
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.price}
                    onChange={handleItemChange}
                    placeholder="145.00"
                    required
                  />

                </div>

                <div className="admin-form-group">

                <ImageUploader
                value={itemForm.imageUrl}
                onChange={(url) =>
                    setItemForm((current) => ({
                    ...current,
                    imageUrl: url,
                    }))
                }
                label="Menu item image"
                
                />

                </div>
              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Display order
                  </label>

                  <input
                    name="sortOrder"
                    type="number"
                    min="0"
                    value={itemForm.sortOrder}
                    onChange={handleItemChange}
                  />

                </div>

                <div />

              </div>

              <div className="admin-menu-form-options">

                <label className="admin-checkbox">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={itemForm.featured}
                    onChange={handleItemChange}
                  />

                  <FiStar />

                  Featured item

                </label>

                <label className="admin-checkbox">

                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={
                      itemForm.isAvailable
                    }
                    onChange={handleItemChange}
                  />

                  <FiCheck />

                  Available

                </label>

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeItemForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  <FiCheck />

                  {editingItem
                    ? "Save Changes"
                    : "Create Item"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminMenu;