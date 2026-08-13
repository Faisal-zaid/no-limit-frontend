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

  // Product fields
  const [fields, setFields] = useState([]);

  // ==============================
  // GET CATEGORIES
  // ==============================

  async function loadCategories() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/category"
      );

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  // ==============================
  // GET PRODUCTS
  // ==============================

  async function loadProducts() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/product"
      );

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
  // ADD NEW FIELD
  // ==============================

  function addField() {
    const newField = {
      temporaryId: Date.now(),

      label: "",
      field_type: "text",
      required: false,
      placeholder: "",

      options: [],
    };

    setFields((previousFields) => [
      ...previousFields,
      newField,
    ]);
  }

  // ==============================
  // REMOVE FIELD
  // ==============================

  function removeField(fieldId) {
    setFields((previousFields) =>
      previousFields.filter(
        (field) => field.temporaryId !== fieldId
      )
    );
  }

  // ==============================
  // UPDATE FIELD
  // ==============================

  function updateField(fieldId, property, value) {
    setFields((previousFields) =>
      previousFields.map((field) => {
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
  // ADD OPTION TO FIELD
  // ==============================

  function addOption(fieldId) {
    setFields((previousFields) =>
      previousFields.map((field) => {
        if (field.temporaryId === fieldId) {
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
        }

        return field;
      })
    );
  }

  // ==============================
  // UPDATE OPTION
  // ==============================

  function updateOption(
    fieldId,
    optionId,
    value
  ) {
    setFields((previousFields) =>
      previousFields.map((field) => {
        if (field.temporaryId !== fieldId) {
          return field;
        }

        return {
          ...field,

          options: field.options.map((option) => {
            if (option.temporaryId === optionId) {
              return {
                ...option,
                value: value,
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
    setFields((previousFields) =>
      previousFields.map((field) => {
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
      // STEP 1 — CREATE PRODUCT
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
      productForm.append("image", image);

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
        alert("Failed to create product");
        return;
      }

      console.log(
        "Product created:",
        productData
      );

      // ==================================
      // IMPORTANT
      // ==================================
      //
      // Your current backend returns:
      //
      // {"message": "Product created successfully"}
      //
      // It does NOT return the newly-created
      // product ID.
      //
      // Therefore we retrieve the products again
      // and find the product we just created.
      //
      // ==================================

      const productsResponse = await fetch(
        "http://127.0.0.1:8001/product"
      );

      const allProducts =
        await productsResponse.json();

      const createdProduct =
        allProducts.find(
          (product) =>
            product.name === name
        );

      if (!createdProduct) {
        alert(
          "Product was created, but its ID could not be found."
        );

        return;
      }

      const productId =
        createdProduct.id;

      console.log(
        "Created product ID:",
        productId
      );

      // ==================================
      // STEP 2 — CREATE PRODUCT FIELDS
      // ==================================

      for (const field of fields) {
        const fieldForm =
          new FormData();

        fieldForm.append(
          "product_id",
          productId
        );

        fieldForm.append(
          "label",
          field.label
        );

        fieldForm.append(
          "field_type",
          field.field_type
        );

        fieldForm.append(
          "required",
          field.required
        );

        fieldForm.append(
          "placeholder",
          field.placeholder
        );

        const fieldResponse =
          await fetch(
            "http://127.0.0.1:8001/productfield",
            {
              method: "POST",
              body: fieldForm,
            }
          );

        const fieldData =
          await fieldResponse.json();

        if (!fieldResponse.ok) {
          console.error(
            "Failed to create field:",
            fieldData
          );

          continue;
        }

        console.log(
          "Field created:",
          fieldData
        );

        // ==================================
        // FIND THE CREATED FIELD
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
                item.product_id === productId
            )
            .find(
              (item) =>
                item.label === field.label
            );

        if (!createdField) {
          console.error(
            "Could not find created field"
          );

          continue;
        }

        const fieldId =
          createdField.id;

        // ==================================
        // STEP 3 — CREATE OPTIONS
        // ==================================

        for (const option of field.options) {
          if (!option.value.trim()) {
            continue;
          }

          const optionForm =
            new FormData();

          optionForm.append(
            "field_id",
            fieldId
          );

          optionForm.append(
            "value",
            option.value
          );

          const optionResponse =
            await fetch(
              "http://127.0.0.1:8001/productfieldoption",
              {
                method: "POST",
                body: optionForm,
              }
            );

          const optionData =
            await optionResponse.json();

          if (!optionResponse.ok) {
            console.error(
              "Failed to create option:",
              optionData
            );

            continue;
          }

          console.log(
            "Option created:",
            optionData
          );
        }
      }

      // ==================================
      // EVERYTHING CREATED
      // ==================================

      alert(
        "Product created successfully!"
      );

      // Clear form

      setName("");
      setCategoryId("");
      setBasePrice("");
      setDescription("");
      setImage(null);
      setFields([]);

      // Refresh product list

      loadProducts();

    } catch (error) {
      console.error(
        "Error creating product:",
        error
      );

      alert(
        "Something went wrong while creating the product."
      );
    }
  }

  return (
    <section className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Product Manager
      </h1>

      {/* =================================
          CREATE PRODUCT
      ================================= */}

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
              setImage(e.target.files[0])
            }
            required
          />
        </div>

        {/* =================================
            CUSTOM FIELDS
        ================================= */}

        <div className="border-t pt-6">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-2xl font-bold">
              Custom Fields
            </h2>

            <button
              type="button"
              onClick={addField}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Field
            </button>

          </div>

          {/* FIELD LIST */}

          <div className="space-y-6">

            {fields.map((field) => (

              <div
                key={field.temporaryId}
                className="border rounded-lg p-5"
              >

                <div className="flex justify-between">

                  <h3 className="text-xl font-semibold">
                    Field
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

                {/* FIELD LABEL */}

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

                {/* FIELD TYPE */}

                <div className="mt-4">

                  <label className="block font-semibold mb-2">
                    Field Type
                  </label>

                  <select
                    value={field.field_type}
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

                  <label className="flex gap-2">

                    <input
                      type="checkbox"
                      checked={field.required}
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
                    placeholder="e.g. Select your size"
                    value={field.placeholder}
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

                {/* =================================
                    OPTIONS
                ================================= */}

                {field.field_type ===
                  "dropdown" && (

                  <div className="mt-6">

                    <div className="flex justify-between items-center">

                      <h4 className="font-semibold">
                        Options
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          addOption(
                            field.temporaryId
                          )
                        }
                        className="text-blue-600"
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
                              placeholder="Option value"
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
                              className="text-red-600"
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

            ))}

          </div>

        </div>

        {/* =================================
            SUBMIT
        ================================= */}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded font-semibold"
        >
          Create Product
        </button>

      </form>

      {/* =================================
          EXISTING PRODUCTS
      ================================= */}

      <div className="mt-16">

        <h2 className="text-2xl font-bold mb-4">
          Existing Products
        </h2>

        <div className="space-y-3">

          {products.map(
            (product) => (

              <div
                key={product.id}
                className="border p-4 rounded"
              >

                 <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-cover rounded-lg"
        />

                <h3 className="font-bold">
                  {product.name}
                </h3>

                <p>
                  Price: {product.base_price}
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