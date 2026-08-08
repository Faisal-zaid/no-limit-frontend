"use client";

import { useState, useEffect } from "react";
export default function Admin(){


    // fetching categories
    useEffect(() => {
    async function loadCategories() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setCategories(data);
    }

    loadCategories();
  }, []);

  //fetching product field
  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setProducts(data);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadProductField() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setProductField(data);
    }

    loadProductField();
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

