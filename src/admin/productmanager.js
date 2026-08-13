"use client";

import { useEffect, useState } from "react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Product information
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Custom fields
  const [fields, setFields] = useState([]);

  // ==============================
  // LOAD CATEGORIES
  // ==============================

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
      console.error("Error loading categories:", error);
    }
  }

  // ==============================
  // LOAD PRODUCTS
  // ==============================

  async function loadProducts() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/product"
      );

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // ==============================
  // ADD FIELD
  // ==============================

  function addField() {
    setFields((previous) => [
      ...previous,
      {
        temporaryId: Date.now() + Math.random(),
        label: "",
        field_type: "text",
        required: false,
        placeholder: "",
        options: [],
      },
    ]);
  }

  // ==============================
  // REMOVE FIELD
  // ==============================

  function removeField(fieldId) {
    setFields((previous) =>
      previous.filter(
        (field) => field.temporaryId !== fieldId
      )
    );
  }

  // ==============================
  // UPDATE FIELD
  // ==============================

  function updateField(fieldId, property, value) {
    setFields((previous) =>
      previous.map((field) => {
        if (field.temporaryId === fieldId) {
          return {
            ...field,
            [property]: value,
          };
        }

        return field;
      })
    );
  }

  // ==============================
  // ADD OPTION
  // ==============================

  function addOption(fieldId) {
    setFields((previous) =>
      previous.map((field) => {
        if (field.temporaryId !== fieldId) {
          return field;
        }

        return {
          ...field,
          options: [
            ...field.options,
            {
              temporaryId: Date.now() + Math.random(),
              value: "",
            },
          ],
        };
      })
    );
  }

  // ==============================
  // UPDATE OPTION
  // ==============================

  function updateOption(fieldId, optionId, value) {
    setFields((previous) =>
      previous.map((field) => {
        if (field.temporaryId !== fieldId) {
          return field;
        }

        return {
          ...field,
          options: field.options.map((option) => {
            if (option.temporaryId === optionId) {
              return {
                ...option,
                value,
              };
            }

            return option;
          }),
        };
      })
    );
  }

  // ==============================
  // REMOVE OPTION
  // ==============================

  function removeOption(fieldId, optionId) {
    setFields((previous) =>
      previous.map((field) => {
        if (field.temporaryId !== fieldId) {
          return field;
        }

        return {
          ...field,
          options: field.options.filter(
            (option) =>
              option.temporaryId !== optionId
          ),
        };
      })
    );
  }

  // ==============================
  // CREATE PRODUCT
  // ==============================

  async function createProduct(e) {
    e.preventDefault();

    try {
      // ==================================
      // VALIDATE CUSTOM FIELDS
      // ==================================

      for (const field of fields) {
        if (!field.label.trim()) {
          alert("Every custom field needs a label.");
          return;
        }

        if (
          field.field_type === "dropdown" &&
          field.options.some(
            (option) => !option.value.trim()
          )
        ) {
          alert(
            `Please fill in all options for "${field.label}".`
          );
          return;
        }
      }

      // ==================================
      // STEP 1: CREATE PRODUCT
      // ==================================

      const productForm = new FormData();

      productForm.append("name", name);
      productForm.append(
        "category_id",
        categoryId
      );
      productForm.append(
        "base_price",
        basePrice
      );
      productForm.append(
        "description",
        description
      );

      if (image) {
        productForm.append("image", image);
      }

      const productResponse = await fetch(
        "http://127.0.0.1:8001/product",
        {
          method: "POST",
          body: productForm,
        }
      );

      const productData =
        await productResponse.json();

      if (!productResponse.ok) {
        console.error(productData);

        alert(
          productData.detail ||
            "Failed to create product."
        );

        return;
      }

      console.log(
        "PRODUCT CREATED:",
        productData
      );

      // ==================================
      // STEP 2: GET CREATED PRODUCT
      // ==================================

      const productsResponse = await fetch(
        "http://127.0.0.1:8001/product"
      );

      const allProducts =
        await productsResponse.json();

      /*
        Your backend currently returns only:

        {
          "message":
          "Product created successfully"
        }

        Therefore we find the product again.
      */

      const createdProduct =
        allProducts
          .filter(
            (product) =>
              product.name === name
          )
          .sort(
            (a, b) => b.id - a.id
          )[0];

      if (!createdProduct) {
        alert(
          "Product was created, but its ID could not be found."
        );

        return;
      }

      const productId =
        createdProduct.id;

      console.log(
        "CREATED PRODUCT ID:",
        productId
      );

      // ==================================
      // STEP 3: CREATE CUSTOM FIELDS
      // ==================================

      for (const field of fields) {
        /*
          IMPORTANT:

          ProductFieldSchema on your backend
          expects JSON.

          NOT FormData.
        */

        const fieldResponse =
          await fetch(
            "http://127.0.0.1:8001/productfield",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                product_id: Number(
                  productId
                ),

                label:
                  field.label.trim(),

                field_type:
                  field.field_type,

                required:
                  Boolean(field.required),

                placeholder:
                  field.placeholder || "",
              }),
            }
          );

        const fieldData =
          await fieldResponse.json();

        console.log(
          "FIELD RESPONSE:",
          fieldData
        );

        if (!fieldResponse.ok) {
          console.error(
            "FIELD CREATION FAILED:",
            fieldData
          );

          continue;
        }

        // ==================================
        // STEP 4: FIND CREATED FIELD
        // ==================================

        const fieldsResponse =
          await fetch(
            "http://127.0.0.1:8001/productfield"
          );

        const allFields =
          await fieldsResponse.json();

        const createdField =
          allFields
            .filter(
              (item) =>
                Number(item.product_id) ===
                Number(productId)
            )
            .filter(
              (item) =>
                item.label ===
                field.label.trim()
            )
            .sort(
              (a, b) => b.id - a.id
            )[0];

        if (!createdField) {
          console.error(
            "Could not find created field:",
            field
          );

          continue;
        }

        const fieldId =
          createdField.id;

        console.log(
          "CREATED FIELD:",
          createdField
        );

        // ==================================
        // STEP 5: CREATE OPTIONS
        // ==================================

        if (
          field.field_type ===
          "dropdown"
        ) {
          for (const option of field.options) {
            if (!option.value.trim()) {
              continue;
            }

            /*
              ProductFieldOptionSchema
              also expects JSON.
            */

            const optionResponse =
              await fetch(
                "http://127.0.0.1:8001/productfieldoption",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    field_id: Number(
                      fieldId
                    ),

                    value:
                      option.value.trim(),
                  }),
                }
              );

            const optionData =
              await optionResponse.json();

            console.log(
              "OPTION RESPONSE:",
              optionData
            );

            if (!optionResponse.ok) {
              console.error(
                "OPTION CREATION FAILED:",
                optionData
              );
            }
          }
        }
      }

      // ==================================
      // SUCCESS
      // ==================================

      alert(
        "Product and customization options created successfully!"
      );

      // Clear form
      setName("");
      setCategoryId("");
      setBasePrice("");
      setDescription("");
      setImage(null);
      setFields([]);

      // Refresh products
      await loadProducts();

    } catch (error) {
      console.error(
        "ERROR CREATING PRODUCT:",
        error
      );

      alert(
        "Something went wrong while creating the product."
      );
    }
  }

  // ==============================
  // UI
  // ==============================

  return (
    <section className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Product Manager
      </h1>

      <form
        onSubmit={createProduct}
        className="max-w-4xl space-y-6"
      >

        {/* PRODUCT NAME */}

        <div>
          <label className="block font-semibold mb-2">
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label className="block font-semibold mb-2">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            className="border p-2 rounded w-full"
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* PRICE */}

        <div>
          <label className="block font-semibold mb-2">
            Base Price
          </label>

          <input
            type="number"
            value={basePrice}
            onChange={(e) =>
              setBasePrice(e.target.value)
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block font-semibold mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="border p-2 rounded w-full"
            rows="4"
          />
        </div>

        {/* IMAGE */}

        <div>
          <label className="block font-semibold mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files?.[0] ||
                  null
              )
            }
            required
          />
        </div>

        {/* ================================= */}
        {/* CUSTOMIZATION */}
        {/* ================================= */}

        <div className="border-t pt-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-2xl font-bold">
              Product Customization
            </h2>

            <button
              type="button"
              onClick={addField}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              + Add Custom Field
            </button>

          </div>

          {/* FIELDS */}

          <div className="space-y-6">

            {fields.map(
              (field, index) => (

                <div
                  key={field.temporaryId}
                  className="border rounded-xl p-5 bg-gray-50"
                >

                  <div className="flex justify-between">

                    <h3 className="text-xl font-semibold">
                      Custom Field {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        removeField(
                          field.temporaryId
                        )
                      }
                      className="text-red-600"
                    >
                      Remove Field
                    </button>

                  </div>

                  {/* LABEL */}

                  <div className="mt-4">

                    <label className="block font-semibold mb-2">
                      Label
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Size"
                      value={field.label}
                      onChange={(e) =>
                        updateField(
                          field.temporaryId,
                          "label",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-full"
                    />

                  </div>

                  {/* TYPE */}

                  <div className="mt-4">

                    <label className="block font-semibold mb-2">
                      Field Type
                    </label>

                    <select
                      value={
                        field.field_type
                      }
                      onChange={(e) =>
                        updateField(
                          field.temporaryId,
                          "field_type",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-full"
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

                    </select>

                  </div>

                  {/* REQUIRED */}

                  <div className="mt-4">

                    <label className="flex gap-2 items-center">

                      <input
                        type="checkbox"
                        checked={
                          field.required
                        }
                        onChange={(e) =>
                          updateField(
                            field.temporaryId,
                            "required",
                            e.target.checked
                          )
                        }
                      />

                      Required field

                    </label>

                  </div>

                  {/* PLACEHOLDER */}

                  <div className="mt-4">

                    <label className="block font-semibold mb-2">
                      Placeholder
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Enter your name"
                      value={
                        field.placeholder
                      }
                      onChange={(e) =>
                        updateField(
                          field.temporaryId,
                          "placeholder",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-full"
                    />

                  </div>

                  {/* DROPDOWN OPTIONS */}

                  {field.field_type ===
                    "dropdown" && (

                    <div className="mt-6 border-t pt-4">

                      <div className="flex justify-between items-center">

                        <h4 className="font-semibold">
                          Dropdown Options
                        </h4>

                        <button
                          type="button"
                          onClick={() =>
                            addOption(
                              field.temporaryId
                            )
                          }
                          className="text-purple-600"
                        >
                          + Add Option
                        </button>

                      </div>

                      <div className="space-y-2 mt-3">

                        {field.options.map(
                          (option) => (

                            <div
                              key={
                                option.temporaryId
                              }
                              className="flex gap-2"
                            >

                              <input
                                type="text"
                                placeholder="e.g. Small"
                                value={
                                  option.value
                                }
                                onChange={(e) =>
                                  updateOption(
                                    field.temporaryId,
                                    option.temporaryId,
                                    e.target.value
                                  )
                                }
                                className="border p-2 rounded flex-1"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(
                                    field.temporaryId,
                                    option.temporaryId
                                  )
                                }
                                className="text-red-600 px-2"
                              >
                                Remove
                              </button>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Create Product
        </button>

      </form>

      {/* ================================= */}
      {/* EXISTING PRODUCTS */}
      {/* ================================= */}

      <div className="mt-16">

        <h2 className="text-2xl font-bold mb-4">
          Existing Products
        </h2>

        <div className="space-y-3">

          {products.map(
            (product) => (

              <div
                key={product.id}
                className="border p-4 rounded-lg"
              >

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-40 h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="font-bold">
                  {product.name}
                </h3>

                <p>
                  Price: KSh{" "}
                  {product.base_price}
                </p>

                <p>
                  Category ID:{" "}
                  {product.category_id}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </section>
  );
}