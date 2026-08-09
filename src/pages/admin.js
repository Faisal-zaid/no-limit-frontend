"use client";

import { useState, useEffect } from "react";
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
    async function loadProductField() {
      const response = await fetch("http://127.0.0.1:8001/productfield");
      const data = await response.json();

      setProductField(data);
    }

    loadProductField();
  }, []);

  //fetching productfieldoption

  useEffect(() => {
    async function loadProductFieldOption() {
      const response = await fetch("http://127.0.0.1:8001/productfieldoption");
      const data = await response.json();

      setProductFieldOption(data);
    }

    loadProductFieldOption();
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

