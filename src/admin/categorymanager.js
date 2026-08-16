"use client";

import { useEffect, useState } from "react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FORM STATE
  // =========================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subheading, setSubheading] = useState("");
  const [image, setImage] = useState(null);

  // =========================
  // EDITING STATE
  // =========================

  const [editingId, setEditingId] = useState(null);


  // =========================
  // GET CATEGORIES
  // =========================

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
      setError("Could not load categories.");
    } finally {
      setLoading(false);
    }
  }


  // Load categories when component mounts
  useEffect(() => {
    loadCategories();
  }, []);


  // =========================
  // CREATE CATEGORY
  // =========================

  async function createCategory() {
    try {
      setError("");

      if (!name || !description || !subheading || !image) {
        setError("Please fill in all fields and select an image.");
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("subheading", subheading);
      formData.append("image", image);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create category");
      }

      console.log(data);

      // Clear form
      clearForm();

      // Get updated categories
      await loadCategories();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // =========================
  // UPDATE CATEGORY
  // =========================

  async function updateCategory() {
    try {
      setError("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("subheading", subheading);

      // Image is optional during update
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/${editingId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update category");
      }

      console.log(data);

      clearForm();

      await loadCategories();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // =========================
  // DELETE CATEGORY
  // =========================

  async function deleteCategory(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete category");
      }

      console.log(data);

      await loadCategories();

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // =========================
  // START EDITING
  // =========================

  function startEditing(category) {
    setEditingId(category.id);

    setName(category.name);
    setDescription(category.description || "");
    setSubheading(category.subheading || "");

    // Don't automatically put the old image
    // into the file input.
    setImage(null);
  }


  // =========================
  // CLEAR FORM
  // =========================

  function clearForm() {
    setEditingId(null);

    setName("");
    setDescription("");
    setSubheading("");
    setImage(null);

    // Reset file input
    const fileInput = document.getElementById("category-image");

    if (fileInput) {
      fileInput.value = "";
    }
  }


  // =========================
  // FORM SUBMIT
  // =========================

  async function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      await updateCategory();
    } else {
      await createCategory();
    }
  }


  // =========================
  // UI
  // =========================

  return (
    <section className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Categories
        </h2>

        <span>
          {categories.length} categories
        </span>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-5 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}


      {/* =========================
          CATEGORY FORM
      ========================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 p-5 bg-white/80 rounded-xl"
      >

        <h3 className="text-xl font-semibold">
          {editingId
            ? "Edit Category"
            : "Create Category"}
        </h3>


        {/* NAME */}

        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full border p-3 rounded"
        />


        {/* DESCRIPTION */}

        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          className="w-full border p-3 rounded"
        />


        {/* SUBHEADING */}

        <input
          type="text"
          placeholder="Subheading"
          value={subheading}
          onChange={(event) =>
            setSubheading(event.target.value)
          }
          className="w-full border p-3 rounded"
        />


        {/* IMAGE */}

        <input
          id="category-image"
          type="file"
          accept="image/*"
          onChange={(event) =>
            setImage(event.target.files[0])
          }
          className="w-full"
        />


        {/* BUTTONS */}

        <div className="flex gap-3">

          <button
            type="submit"
            className="px-5 py-2 bg-black text-white rounded"
          >
            {editingId
              ? "Update Category"
              : "Create Category"}
          </button>


          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="px-5 py-2 border rounded"
            >
              Cancel
            </button>
          )}

        </div>

      </form>


      {/* =========================
          CATEGORY LIST
      ========================= */}

      <div>

        <h3 className="text-xl font-semibold mb-5">
          Existing Categories
        </h3>


        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {categories.map((category) => (

              <div
                key={category.id}
                className="bg-white/90 rounded-xl overflow-hidden shadow"
              >

                {/* IMAGE */}

                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                )}


                {/* CONTENT */}

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {category.name}
                  </h3>

                  <p className="text-sm mt-2">
                    {category.subheading}
                  </p>

                  <p className="text-sm mt-2">
                    {category.description}
                  </p>


                  {/* ACTIONS */}

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        startEditing(category)
                      }
                      className="px-4 py-2 border rounded"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        deleteCategory(category.id)
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}