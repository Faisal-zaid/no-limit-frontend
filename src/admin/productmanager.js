"use client";

import { useState, useEffect } from "react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Editing state
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // =====================================================
  // GET CATEGORIES
  // =====================================================

  async function loadCategories() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/category"
      );

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await response.json();

      setCategories(data);

    } catch (error) {
      console.error(error);
      setError("Could not load categories.");
    }
  }


  // =====================================================
  // GET PRODUCTS
  // =====================================================

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8001/product"
      );

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(data);

    } catch (error) {
      console.error(error);
      setError("Could not load products.");

    } finally {
      setLoading(false);
    }
  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);


  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  async function createProduct() {

    try {

      setError("");

      if (
        !name ||
        !categoryId ||
        !basePrice ||
        !description ||
        !image
      ) {
        setError("Please fill in all fields and select an image.");
        return;
      }


      const formData = new FormData();

      formData.append("name", name);
      formData.append("category_id", categoryId);
      formData.append("base_price", basePrice);
      formData.append("description", description);
      formData.append("image", image);


      const response = await fetch(
        "http://127.0.0.1:8001/product",
        {
          method: "POST",
          body: formData,
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create product"
        );
      }


      console.log(data);

      clearForm();

      await loadProducts();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }

  }


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  async function updateProduct() {

    try {

      setError("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("category_id", categoryId);
      formData.append("base_price", basePrice);
      formData.append("description", description);


      // Image is optional during update

      if (image) {
        formData.append("image", image);
      }


      const response = await fetch(
        `http://127.0.0.1:8001/product/${editingId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update product"
        );
      }


      console.log(data);

      clearForm();

      await loadProducts();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }

  }


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  async function deleteProduct(productId) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");

      const response = await fetch(
        `http://127.0.0.1:8001/product/${productId}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete product"
        );
      }


      console.log(data);

      await loadProducts();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }

  }


  // =====================================================
  // START EDITING
  // =====================================================

  function startEditing(product) {

    setEditingId(product.id);

    setName(product.name);

    setCategoryId(
      String(product.category_id)
    );

    setBasePrice(
      String(product.base_price)
    );

    setDescription(
      product.description || ""
    );

    // Don't put old image into file input
    setImage(null);

  }


  // =====================================================
  // CLEAR FORM
  // =====================================================

  function clearForm() {

    setEditingId(null);

    setName("");
    setCategoryId("");
    setBasePrice("");
    setDescription("");
    setImage(null);


    const fileInput =
      document.getElementById("product-image");

    if (fileInput) {
      fileInput.value = "";
    }

  }


  // =====================================================
  // SUBMIT FORM
  // =====================================================

  async function handleSubmit(event) {

    event.preventDefault();

    if (editingId) {

      await updateProduct();

    } else {

      await createProduct();

    }

  }


  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  function getCategoryName(categoryId) {

    const category = categories.find(
      (category) =>
        category.id === categoryId
    );

    return category
      ? category.name
      : `Category #${categoryId}`;

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <section className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Products
        </h2>

        <span>
          {products.length} products
        </span>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mb-5 p-3 bg-red-100 text-red-700 rounded">

          {error}

        </div>

      )}


      {/* =================================================
          PRODUCT FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 p-5 bg-white/80 rounded-xl"
      >

        <h3 className="text-xl font-semibold">

          {editingId
            ? "Edit Product"
            : "Create Product"}

        </h3>


        {/* NAME */}

        <div>

          <label className="block mb-1">
            Product name
          </label>

          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="w-full border p-3 rounded"
          />

        </div>


        {/* CATEGORY */}

        <div>

          <label className="block mb-1">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            className="w-full border p-3 rounded"
          >

            <option value="">
              Select a category
            </option>

            {categories.map((category) => (

              <option
                key={category.id}
                value={category.id}
              >

                {category.name}

              </option>

            ))}

          </select>

        </div>


        {/* PRICE */}

        <div>

          <label className="block mb-1">
            Base price
          </label>

          <input
            type="number"
            placeholder="Price"
            value={basePrice}
            onChange={(event) =>
              setBasePrice(event.target.value)
            }
            className="w-full border p-3 rounded"
          />

        </div>


        {/* DESCRIPTION */}

        <div>

          <label className="block mb-1">
            Description
          </label>

          <textarea
            placeholder="Product description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            className="w-full border p-3 rounded"
          />

        </div>


        {/* IMAGE */}

        <div>

          <label className="block mb-1">
            Product image
          </label>

          <input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setImage(event.target.files[0])
            }
            className="w-full"
          />

        </div>


        {/* BUTTONS */}

        <div className="flex gap-3">

          <button
            type="submit"
            className="px-5 py-2 bg-black text-white rounded"
          >

            {editingId
              ? "Update Product"
              : "Create Product"}

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


      {/* =================================================
          PRODUCTS
      ================================================= */}

      <div>

        <h3 className="text-xl font-semibold mb-5">
          Existing Products
        </h3>


        {loading ? (

          <p>Loading products...</p>

        ) : products.length === 0 ? (

          <p>No products found.</p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-white/90 rounded-xl overflow-hidden shadow"
              >

                {/* IMAGE */}

                {product.image && (

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />

                )}


                {/* PRODUCT INFORMATION */}

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {product.name}
                  </h3>


                  <p className="mt-2">
                    Category:{" "}
                    {getCategoryName(
                      product.category_id
                    )}
                  </p>


                  <p className="mt-2">
                    Price:{" "}
                    {product.base_price}
                  </p>


                  <p className="mt-2 text-sm">
                    {product.description}
                  </p>


                  {/* ACTIONS */}

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        startEditing(product)
                      }
                      className="px-4 py-2 border rounded"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        deleteProduct(product.id)
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