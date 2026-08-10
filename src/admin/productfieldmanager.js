"use client";

import { useState, useEffect } from "react";

export default function ProductFieldManager() {
  const [productFields, setProductFields] = useState([]);

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

  useEffect(() => {
    async function loadProductFields() {
      const response = await fetch("http://127.0.0.1:8001/productfield");

      const data = await response.json();

      setProductFields(data);
    }

    loadProductFields();
  }, []);

  
  async function createProductField(fieldData) {
    const formData = new FormData();

    formData.append("product_id", fieldData.product_id);
    formData.append("label", fieldData.label);
    formData.append("field_type", fieldData.field_type);
    formData.append("required", fieldData.required);
    formData.append("placeholder", fieldData.placeholder);

    const response = await fetch("http://127.0.0.1:8001/productfield", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log(data);
  }

  
  async function updateProductField(fieldId, fieldData) {
    const formData = new FormData();

    formData.append("product_id", fieldData.product_id);
    formData.append("label", fieldData.label);
    formData.append("field_type", fieldData.field_type);
    formData.append("required", fieldData.required);
    formData.append("placeholder", fieldData.placeholder);

    const response = await fetch(
      `http://127.0.0.1:8001/productfield/${fieldId}`,
      {
        method: "PATCH",
        body: formData,
      },
    );

    const data = await response.json();

    console.log(data);
  }

  async function deleteProductField(fieldId) {
    const response = await fetch(
      `http://127.0.0.1:8001/productfield/${fieldId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    console.log(data);
  }

  return (
    <section>
      {" "}
      <h2>Product Fields</h2>
      {productFields.map((field) => (
        <div key={field.id}>
          <h3>{field.label}</h3>

          <p>Type: {field.field_type}</p>
          <p>Product ID: {field.product_id}</p>
          <p>Required: {field.required ? "Yes" : "No"}</p>

          <button onClick={() => deleteProductField(field.id)}>Delete</button>
        </div>
      ))}
    </section>
  );
}
