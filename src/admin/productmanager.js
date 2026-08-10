"use client";

import { useState, useEffect } from "react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);

    // fetching categories
  useEffect(() => {
    async function loadCategories() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setCategories(data);
    }

    loadCategories();
  }, []);

  // GET products
  useEffect(() => {
    async function loadProducts() {
      const response = await fetch(
        "http://127.0.0.1:8001/product"
      );

      const data = await response.json();

      setProducts(data);
    }

    loadProducts();
  }, []);

  // POST product
  async function createProduct(productData) {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("category_id", productData.category_id);
    formData.append("base_price", productData.base_price);
    formData.append("description", productData.description);
    formData.append("image", productData.image);

    const response = await fetch(
      "http://127.0.0.1:8001/product",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);
  }

  // PATCH product
  async function updateProduct(productId, productData) {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("category_id", productData.category_id);
    formData.append("base_price", productData.base_price);
    formData.append("description", productData.description);

    if (productData.image) {
      formData.append("image", productData.image);
    }

    const response = await fetch(
      `http://127.0.0.1:8001/product/${productId}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);
  }

  // DELETE product
  async function deleteProduct(productId) {
    const response = await fetch(
      `http://127.0.0.1:8001/product/${productId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log(data);
  }

  return (
    <div>
      <h1>Admin Panel</h1>

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.base_price}</p>

          <button onClick={() => deleteProduct(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}