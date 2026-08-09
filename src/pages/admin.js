"use client";

import { useState, useEffect } from "react";
import { getCategories ,deleteCategory } from "@/lib/api";
export default function Admin(){

  const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
const [productFields, setProductFields] = useState([]);
const [productFieldOptions, setProductFieldOptions] = useState([]);


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

  const response = await fetch(
    "http://127.0.0.1:8001/category",
    {
      method: "POST",
      body: formData
    }
  );

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
      body: formData
    }
  );

  const data = await response.json();

  console.log(data);
}

//delete category 

async function deleteCategory(categoryId) {
  const response = await fetch(
    `http://127.0.0.1:8001/category/${categoryId}`,
    {
      method: "DELETE"
    }
  );

  const data = await response.json();

  console.log(data);
}

  //fetching product 
  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("http://127.0.0.1:8001/product");
      const data = await response.json();

      setProducts(data);
    }

    loadProducts();
  }, []);

  // fetching product field

  useEffect(() => {
    async function loadProductFields() {
      const response = await fetch("http://127.0.0.1:8001/productfield");
      const data = await response.json();

      setProductField(data);
    }

    loadProductField();
  }, []);

  //fetching productfieldoption

  useEffect(() => {
    async function loadProductFieldOptions() {
      const response = await fetch("http://127.0.0.1:8001/productfieldoption");
      const data = await response.json();

      setProductFieldOption(data);
    }

    loadProductFieldOptions();
  }, []);

return(
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">
        <div className="flex gap-3">
            <h2 >
                Admin Panel
            </h2>
            <button>Log out</button>
        </div>
    </section>
)
}

