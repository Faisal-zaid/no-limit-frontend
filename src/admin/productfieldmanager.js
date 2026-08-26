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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Could not load products.");
    }
  }

  // =====================================================
  // GET PRODUCT FIELDS
  // =====================================================
  async function loadProductFields(selectedProductId = "") {
    try {
      setLoading(true);
      setError("");

      let url = `${process.env.NEXT_PUBLIC_API_URL}/productfield`;
      if (selectedProductId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/productfield/product/${selectedProductId}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load product fields");

      const data = await response.json();
      setProductFields(data);
    } catch (err) {
      console.error(err);
      setError("Could not load product fields.");
    } finally {
      setLoading(false);
    }
  }

  // Load products once on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Reload product fields whenever selected product changes
  useEffect(() => {
    loadProductFields(productId);
  }, [productId]);

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
        throw new Error(data.detail || "Failed to create product field");
      }

      clearForm();
      await loadProductFields(productId);
    } catch (err) {
      console.error(err);
      setError(err.message);
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
        throw new Error(data.detail || "Failed to update product field");
      }

      clearForm();
      await loadProductFields(productId);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  // =====================================================
  // DELETE PRODUCT FIELD
  // =====================================================
  async function deleteProductField(fieldId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product field?"
    );
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/productfield/${fieldId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete product field");
      }

      await loadProductFields(productId);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  function startEditing(field) {
    setEditingId(field.id);
    setProductId(String(field.product_id));
    setLabel(field.label);
    setFieldType(field.field_type);
    setRequired(field.required);
    setPlaceholder(field.placeholder || "");
  }

  function clearForm() {
    setEditingId(null);
    setProductId("");
    setLabel("");
    setFieldType("text");
    setRequired(false);
    setPlaceholder("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (editingId) {
      await updateProductField();
    } else {
      await createProductField();
    }
  }

  function getProductName(pId) {
    const product = products.find((p) => String(p.id) === String(pId));
    return product ? product.name : `Product #${pId}`;
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Fields</h2>
        <span>{productFields.length} fields</span>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 p-5 bg-white/80 rounded-xl"
      >
        <h3 className="text-xl font-semibold">
          {editingId ? "Edit Product Field" : "Create Product Field"}
        </h3>

        <div>
          <label className="block mb-1">Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Field label</label>
          <input
            type="text"
            placeholder="e.g. Size"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
  <label className="block mb-1 text-black font-medium">Field type</label>
  <select
    value={fieldType}
    onChange={(e) => setFieldType(e.target.value)}
    className="w-full border p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
  >
    <option value="text" className="bg-white text-black p-2">Text</option>
    <option value="number" className="bg-white text-black p-2">Number</option>
    <option value="dropdown" className="bg-white text-black p-2">Dropdown</option>
    <option value="image" className="bg-white text-black p-2">Image Upload</option>
    <option value="textarea" className="bg-white text-black p-2">Textarea</option>
    <option value="date" className="bg-white text-black p-2">Date</option>
  </select>
</div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          Required field
        </label>

        <div>
          <label className="block mb-1">Placeholder</label>
          <input
            type="text"
            placeholder="e.g. Enter your size"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-black text-white rounded"
          >
            {editingId ? "Update Field" : "Create Field"}
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

      <div>
        <h3 className="text-xl font-semibold mb-5">Existing Product Fields</h3>

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
                    <h3 className="text-xl font-bold">{field.label}</h3>
                    <p>Product: {getProductName(field.product_id)}</p>
                    <p>Type: {field.field_type}</p>
                    <p>Required: {field.required ? "Yes" : "No"}</p>
                    {field.placeholder && (
                      <p>Placeholder: {field.placeholder}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(field)}
                      className="px-4 py-2 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProductField(field.id)}
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