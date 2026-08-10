"use client";

import { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "@/lib/api";
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

  // creating category

  async function createCategory(categoryData) {
    const formData = new FormData();

    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("subheading", categoryData.subheading);
    formData.append("image", categoryData.image);

    const response = await fetch("http://127.0.0.1:8001/category", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log(data);
  }

  //patch category

  async function updateCategory(categoryId, categoryData) {
    const formData = new FormData();

    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    formData.append("subheading", categoryData.subheading);

    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }

    const response = await fetch(
      `http://127.0.0.1:8001/category/${categoryId}`,
      {
        method: "PATCH",
        body: formData,
      },
    );

    const data = await response.json();

    console.log(data);
  }

  //delete category

  async function deleteCategory(categoryId) {
    const response = await fetch(
      `http://127.0.0.1:8001/category/${categoryId}`,
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
