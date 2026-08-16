"use client";

import { useEffect, useState } from "react";

export default function ProductFieldManager() {
  const [productFields, setProductFields] = useState([]);
  const [products, setProducts] = useState([]);

  // Form state
  const [productId, setProductId] = useState("");
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [required, setRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // =====================================================
  // GET PRODUCTS
  // =====================================================

  async function loadProducts() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product`
      );

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(data);

    } catch (error) {
      console.error(error);
      setError("Could not load products.");
    }
  }


  // =====================================================
  // GET PRODUCT FIELDS
  // =====================================================

  async function loadProductFields() {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/productfield`
      );

      if (!response.ok) {
        throw new Error("Failed to load product fields");
      }

      const data = await response.json();

      setProductFields(data);

    } catch (error) {
      console.error(error);
      setError("Could not load product fields.");

    } finally {
      setLoading(false);
    }
  }


  // =====================================================
  // LOAD EVERYTHING WHEN COMPONENT OPENS
  // =====================================================

  useEffect(() => {
    loadProducts();
    loadProductFields();
  }, []);


  // =====================================================
  // CREATE PRODUCT FIELD
  // =====================================================

  async function createProductField() {

    try {

      setError("");

      if (!productId || !label || !fieldType) {
        setError("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();

      formData.append("product_id", productId);
      formData.append("label", label);
      formData.append("field_type", fieldType);
      formData.append("required", required);
      formData.append("placeholder", placeholder);


      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/productfield`,
        {
          method: "POST",
          body: formData,
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create product field"
        );
      }


      console.log(data);

      clearForm();

      await loadProductFields();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }

  }


  // =====================================================
  // UPDATE PRODUCT FIELD
  // =====================================================

  async function updateProductField() {

    try {

      setError("");

      const formData = new FormData();

      formData.append("product_id", productId);
      formData.append("label", label);
      formData.append("field_type", fieldType);
      formData.append("required", required);
      formData.append("placeholder", placeholder);


      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/productfield/${editingId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update product field"
        );
      }


      console.log(data);

      clearForm();

      await loadProductFields();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }

  }


  // =====================================================
  // DELETE PRODUCT FIELD
  // =====================================================

  async function deleteProductField(fieldId) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product field?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/productfield/${fieldId}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete product field"
        );
      }


      console.log(data);

      await loadProductFields();

    } catch (error) {

      console.error(error);

      setError(error.message);

    }

  }


  // =====================================================
  // START EDITING
  // =====================================================

  function startEditing(field) {

    setEditingId(field.id);

    setProductId(String(field.product_id));

    setLabel(field.label);

    setFieldType(field.field_type);

    setRequired(field.required);

    setPlaceholder(field.placeholder || "");

  }


  // =====================================================
  // CLEAR FORM
  // =====================================================

  function clearForm() {

    setEditingId(null);

    setProductId("");

    setLabel("");

    setFieldType("text");

    setRequired(false);

    setPlaceholder("");

  }


  // =====================================================
  // FORM SUBMIT
  // =====================================================

  async function handleSubmit(event) {

    event.preventDefault();

    if (editingId) {

      await updateProductField();

    } else {

      await createProductField();

    }

  }


  // =====================================================
  // FIND PRODUCT NAME
  // =====================================================

  function getProductName(productId) {

    const product = products.find(
      (product) => product.id === productId
    );

    return product
      ? product.name
      : `Product #${productId}`;

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <section className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Product Fields
        </h2>

        <span>
          {productFields.length} fields
        </span>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mb-5 p-3 bg-red-100 text-red-700 rounded">

          {error}

        </div>

      )}


      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 p-5 bg-white/80 rounded-xl"
      >

        <h3 className="text-xl font-semibold">

          {editingId
            ? "Edit Product Field"
            : "Create Product Field"}

        </h3>


        {/* PRODUCT */}

        <div>

          <label className="block mb-1">
            Product
          </label>

          <select
            value={productId}
            onChange={(event) =>
              setProductId(event.target.value)
            }
            className="w-full border p-3 rounded"
          >

            <option value="">
              Select a product
            </option>

            {products.map((product) => (

              <option
                key={product.id}
                value={product.id}
              >

                {product.name}

              </option>

            ))}

          </select>

        </div>


        {/* LABEL */}

        <div>

          <label className="block mb-1">
            Field label
          </label>

          <input
            type="text"
            placeholder="e.g. Size"
            value={label}
            onChange={(event) =>
              setLabel(event.target.value)
            }
            className="w-full border p-3 rounded"
          />

        </div>


        {/* FIELD TYPE */}

        <div>

          <label className="block mb-1">
            Field type
          </label>

          <select
            value={fieldType}
            onChange={(event) =>
              setFieldType(event.target.value)
            }
            className="w-full border p-3 rounded"
          >

            <option value="text">
              Text
            </option>

            <option value="number">
              Number
            </option>

            <option value="dropdown">
              Dropdown
            </option>

            <option value="textarea">
              Textarea
            </option>

            <option value="date">
              Date
            </option>

          </select>

        </div>


        {/* REQUIRED */}

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={required}
            onChange={(event) =>
              setRequired(event.target.checked)
            }
          />

          Required field

        </label>


        {/* PLACEHOLDER */}

        <div>

          <label className="block mb-1">
            Placeholder
          </label>

          <input
            type="text"
            placeholder="e.g. Enter your size"
            value={placeholder}
            onChange={(event) =>
              setPlaceholder(event.target.value)
            }
            className="w-full border p-3 rounded"
          />

        </div>


        {/* BUTTONS */}

        <div className="flex gap-3">

          <button
            type="submit"
            className="px-5 py-2 bg-black text-white rounded"
          >

            {editingId
              ? "Update Field"
              : "Create Field"}

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
          EXISTING FIELDS
      ================================================= */}

      <div>

        <h3 className="text-xl font-semibold mb-5">
          Existing Product Fields
        </h3>


        {loading ? (

          <p>Loading fields...</p>

        ) : productFields.length === 0 ? (

          <p>No product fields found.</p>

        ) : (

          <div className="space-y-4">

            {productFields.map((field) => (

              <div
                key={field.id}
                className="bg-white/90 p-5 rounded-xl shadow"
              >

                <div className="flex justify-between">

                  <div>

                    <h3 className="text-xl font-bold">
                      {field.label}
                    </h3>

                    <p>
                      Product:{" "}
                      {getProductName(field.product_id)}
                    </p>

                    <p>
                      Type: {field.field_type}
                    </p>

                    <p>
                      Required:{" "}
                      {field.required
                        ? "Yes"
                        : "No"}
                    </p>

                    {field.placeholder && (

                      <p>
                        Placeholder:{" "}
                        {field.placeholder}
                      </p>

                    )}

                  </div>


                  {/* ACTIONS */}

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        startEditing(field)
                      }
                      className="px-4 py-2 border rounded"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        deleteProductField(field.id)
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