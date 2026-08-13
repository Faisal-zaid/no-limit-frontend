"use client";

import { useEffect, useState } from "react";

export default function Productdisplay({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [productFields, setProductFields] = useState([]);
  const [productFieldOptions, setProductFieldOptions] = useState([]);

  const [loading, setLoading] = useState(true);

  // Product currently being customized
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Show/hide customization popup
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Customer's custom selections
  const [customValues, setCustomValues] = useState({});

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // GET PRODUCTS
  // ==========================================

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/product"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // ==========================================
  // GET PRODUCT FIELDS
  // ==========================================

  useEffect(() => {
    async function loadProductFields() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/productfield"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product fields");
        }

        const data = await response.json();

        setProductFields(data);
      } catch (error) {
        console.error(
          "Failed to load product fields:",
          error
        );
      }
    }

    loadProductFields();
  }, []);

  // ==========================================
  // GET PRODUCT FIELD OPTIONS
  // ==========================================

  useEffect(() => {
    async function loadProductFieldOptions() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/productfieldoption"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch product field options"
          );
        }

        const data = await response.json();

        setProductFieldOptions(data);
      } catch (error) {
        console.error(
          "Failed to load product field options:",
          error
        );
      }
    }

    loadProductFieldOptions();
  }, []);

  // ==========================================
  // FILTER PRODUCTS BY CATEGORY
  // ==========================================

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category_id === selectedCategory.id
      )
    : products;

  // ==========================================
  // OPEN CUSTOMIZATION POPUP
  // ==========================================

  function openCustomizer(product) {
    setSelectedProduct(product);

    // Clear previous selections
    setCustomValues({});

    // Reset quantity
    setQuantity(1);

    // Open popup
    setShowCustomizer(true);
  }

  // ==========================================
  // CLOSE CUSTOMIZATION POPUP
  // ==========================================

  function closeCustomizer() {
    setShowCustomizer(false);
    setSelectedProduct(null);
    setCustomValues({});
    setQuantity(1);
  }

  // ==========================================
  // HANDLE CUSTOM FIELD CHANGE
  // ==========================================

  function handleFieldChange(fieldId, value) {
    setCustomValues((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  }

  // ==========================================
  // GET FIELDS FOR SELECTED PRODUCT
  // ==========================================

  const selectedProductFields = selectedProduct
    ? productFields.filter(
        (field) =>
          Number(field.product_id) ===
          Number(selectedProduct.id)
      )
    : [];

  // ==========================================
  // GET OPTIONS FOR A FIELD
  // ==========================================

  function getFieldOptions(fieldId) {
    return productFieldOptions.filter(
      (option) =>
        Number(option.field_id) === Number(fieldId)
    );
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

  function addToCart() {
    // Check required fields
    for (const field of selectedProductFields) {
      if (
        field.required &&
        !customValues[field.id]
      ) {
        alert(
          `${field.label} is required.`
        );

        return;
      }
    }

    // Create the cart item
    const cartItem = {
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      description: selectedProduct.description,
      base_price: selectedProduct.base_price,
      image: selectedProduct.image,
      quantity: quantity,

      // Customer's custom selections
      custom_values: customValues,
    };

    console.log("ADDING TO CART:");
    console.log(cartItem);

    /*
      Example:

      {
        product_id: 5,
        name: "Custom T-Shirt",
        base_price: 1500,
        quantity: 2,

        custom_values: {
          10: "Large",
          11: "Purple",
          12: "Faisal"
        }
      }
    */

    /*
      THIS is where we will connect
      your CartContext.

      For example:

      addToCart(cartItem);
    */

    closeCustomizer();
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading products...
      </div>
    );
  }

  // ==========================================
  // NO PRODUCTS
  // ==========================================

  if (filteredProducts.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No products found for{" "}
        {selectedCategory?.name || "this category"}.
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      {/* ====================================== */}
      {/* PRODUCTS */}
      {/* ====================================== */}

      <div className="p-6 bg-white rounded-xl">

        <h2 className="text-xl font-bold mb-6 text-gray-800">
          {selectedCategory
            ? `${selectedCategory.name} Products`
            : "All Products"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="
                border border-gray-200
                rounded-xl
                p-4
                flex flex-col
                justify-between
                hover:shadow-md
                transition-shadow
                bg-white
              "
            >

              {/* PRODUCT INFORMATION */}

              <div>

                {/* IMAGE */}

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      w-full
                      h-40
                      object-cover
                      rounded-lg
                      mb-3
                    "
                  />
                )}

                {/* NAME */}

                <h3 className="
                  text-lg
                  font-semibold
                  text-gray-900
                  mb-2
                ">
                  {product.name}
                </h3>

                {/* DESCRIPTION */}

                <p className="
                  text-sm
                  text-gray-600
                  line-clamp-2
                  mb-4
                ">
                  {product.description ||
                    "No description available."}
                </p>

                {/* PRICE */}

                <p className="
                  font-bold
                  text-purple-600
                  mb-4
                ">
                  KSh {product.base_price}
                </p>

              </div>

              {/* VIEW BUTTON */}

              <button
                onClick={() =>
                  openCustomizer(product)
                }
                className="
                  w-full
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  py-2
                  rounded-lg
                  transition
                "
              >
                View
              </button>

            </div>
          ))}

        </div>

      </div>


      {/* ====================================== */}
      {/* CUSTOMIZATION MODAL */}
      {/* ====================================== */}

      {showCustomizer && selectedProduct && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >

          {/* MODAL BOX */}

          <div
            className="
              bg-white
              rounded-2xl
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              shadow-2xl
            "
          >

            {/* ================================= */}
            {/* MODAL HEADER */}
            {/* ================================= */}

            <div
              className="
                flex
                justify-between
                items-center
                border-b
                p-5
              "
            >

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-gray-900
                ">
                  {selectedProduct.name}
                </h2>

                <p className="
                  text-purple-600
                  font-semibold
                ">
                  KSh {selectedProduct.base_price}
                </p>

              </div>

              <button
                onClick={closeCustomizer}
                className="
                  text-gray-500
                  hover:text-black
                  text-3xl
                  leading-none
                "
              >
                ×
              </button>

            </div>


            {/* ================================= */}
            {/* PRODUCT IMAGE */}
            {/* ================================= */}

            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="
                  w-full
                  h-56
                  object-cover
                "
              />
            )}


            {/* ================================= */}
            {/* CUSTOMIZATION CONTENT */}
            {/* ================================= */}

            <div className="p-5">

              <h3 className="
                font-bold
                text-lg
                mb-5
              ">
                Customize your product
              </h3>


              {/* ================================= */}
              {/* PRODUCT FIELDS */}
              {/* ================================= */}

              {selectedProductFields.length === 0 ? (

                <p className="
                  text-gray-500
                  mb-5
                ">
                  This product has no customization
                  options.
                </p>

              ) : (

                <div className="space-y-5">

                  {selectedProductFields.map(
                    (field) => {

                      const fieldOptions =
                        getFieldOptions(field.id);

                      return (
                        <div
                          key={field.id}
                        >

                          {/* FIELD LABEL */}

                          <label className="
                            block
                            font-medium
                            mb-2
                            text-gray-800
                          ">
                            {field.label}

                            {field.required && (
                              <span className="
                                text-red-500
                                ml-1
                              ">
                                *
                              </span>
                            )}
                          </label>


                          {/* ===================== */}
                          {/* DROPDOWN */}
                          {/* ===================== */}

                          {field.field_type ===
                            "dropdown" && (

                            <select
                              value={
                                customValues[
                                  field.id
                                ] || ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  field.id,
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                p-3
                                bg-white
                              "
                            >

                              <option value="">
                                Select{" "}
                                {field.label}
                              </option>

                              {fieldOptions.map(
                                (option) => (
                                  <option
                                    key={
                                      option.id
                                    }
                                    value={
                                      option.value
                                    }
                                  >
                                    {option.value}
                                  </option>
                                )
                              )}

                            </select>
                          )}


                          {/* ===================== */}
                          {/* TEXT */}
                          {/* ===================== */}

                          {field.field_type ===
                            "text" && (

                            <input
                              type="text"
                              value={
                                customValues[
                                  field.id
                                ] || ""
                              }
                              placeholder={
                                field.placeholder ||
                                ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  field.id,
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                p-3
                              "
                            />
                          )}


                          {/* ===================== */}
                          {/* NUMBER */}
                          {/* ===================== */}

                          {field.field_type ===
                            "number" && (

                            <input
                              type="number"
                              value={
                                customValues[
                                  field.id
                                ] || ""
                              }
                              placeholder={
                                field.placeholder ||
                                ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  field.id,
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                p-3
                              "
                            />
                          )}


                          {/* ===================== */}
                          {/* TEXTAREA */}
                          {/* ===================== */}

                          {field.field_type ===
                            "textarea" && (

                            <textarea
                              value={
                                customValues[
                                  field.id
                                ] || ""
                              }
                              placeholder={
                                field.placeholder ||
                                ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  field.id,
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                p-3
                                min-h-[100px]
                              "
                            />
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )}


              {/* ================================= */}
              {/* QUANTITY */}
              {/* ================================= */}

              <div className="mt-7">

                <label className="
                  block
                  font-medium
                  mb-2
                ">
                  Quantity
                </label>

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <button
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1
                        )
                      )
                    }
                    className="
                      w-10
                      h-10
                      border
                      border-gray-300
                      rounded-lg
                      hover:bg-gray-100
                    "
                  >
                    −
                  </button>

                  <span className="
                    font-bold
                    text-lg
                  ">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity(
                        quantity + 1
                      )
                    }
                    className="
                      w-10
                      h-10
                      border
                      border-gray-300
                      rounded-lg
                      hover:bg-gray-100
                    "
                  >
                    +
                  </button>

                </div>

              </div>


              {/* ================================= */}
              {/* ADD TO CART */}
              {/* ================================= */}

              <button
                onClick={addToCart}
                className="
                  w-full
                  mt-7
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  py-3
                  rounded-lg
                  font-semibold
                  transition
                "
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}