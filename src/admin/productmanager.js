"use client";

import { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "@/lib/api";
export default function ProductManager() {
  const [products, setProducts] = useState([]);
  
  // fetching categories
  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("http://127.0.0.1:8001/product");
      const data = await response.json();

      setProducts(data);
    }

    loadCategories();
  }, []);

  // creating category

  async function createProduct(productData) {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("name", productData.category_id);
    formData.append("description", productData.description);
    formData.append("subheading", productData.base_price);
    formData.append("image", productData.image);

    const response = await fetch("http://127.0.0.1:8001/product", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log(data);
  }

  //patch category

  async function updateProduct(productId, productData) {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("name", productData.category_id);
    formData.append("description", productData.description);
    formData.append("subheading", productData.base_price);
    formData.append("image", productData.image);

    if (productData.image) {
      formData.append("image", productData.image);
    }

    const response = await fetch(
      `http://127.0.0.1:8001/product/${productId}`,
      {
        method: "PATCH",
        body: formData,
      },
    );

    const data = await response.json();

    console.log(data);
  }

  //delete category

  async function deleteProduct(productId) {
    const response = await fetch(
      `http://127.0.0.1:8001/category/${productId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    console.log(data);
  }

  
  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">
      <div className="flex gap-3">
        <h2>Admin Panel</h2>
        <button>Log out</button>
      </div>
    </section>
  );
}
