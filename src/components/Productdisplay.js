"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Productdisplay({
  selectedCategory,
}) {
   const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [productFields, setProductFields] =
    useState([]);
  const [productFieldOptions, setProductFieldOptions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showCustomizer, setShowCustomizer] =
    useState(false);

  const [customValues, setCustomValues] =
    useState({});

  const [quantity, setQuantity] =
    useState(1);

  // ==========================================
  // LOAD EVERYTHING
  // ==========================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
          productsResponse,
          fieldsResponse,
          optionsResponse,
        ] = await Promise.all([
          fetch(
            "http://127.0.0.1:8001/product"
          ),

          fetch(
            "http://127.0.0.1:8001/productfield"
          ),

          fetch(
            "http://127.0.0.1:8001/productfieldoption"
          ),
        ]);

        if (!productsResponse.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        if (!fieldsResponse.ok) {
          throw new Error(
            "Failed to load product fields"
          );
        }

        if (!optionsResponse.ok) {
          throw new Error(
            "Failed to load product options"
          );
        }

        const productsData =
          await productsResponse.json();

        const fieldsData =
          await fieldsResponse.json();

        const optionsData =
          await optionsResponse.json();

        console.log(
          "PRODUCTS:",
          productsData
        );

        console.log(
          "PRODUCT FIELDS:",
          fieldsData
        );

        console.log(
          "PRODUCT FIELD OPTIONS:",
          optionsData
        );

        setProducts(productsData);
        setProductFields(fieldsData);
        setProductFieldOptions(
          optionsData
        );

      } catch (error) {
        console.error(
          "Failed to load product data:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts =
    selectedCategory
      ? products.filter(
          (product) =>
            Number(product.category_id) ===
            Number(selectedCategory.id)
        )
      : products;

  // ==========================================
  // OPEN CUSTOMIZER
  // ==========================================

  function openCustomizer(product) {
    console.log(
      "================================"
    );

    console.log(
      "SELECTED PRODUCT:",
      product
    );

    console.log(
      "PRODUCT ID:",
      product.id
    );

    console.log(
      "ALL PRODUCT FIELDS:",
      productFields
    );

    const fieldsForProduct =
      productFields.filter(
        (field) =>
          Number(field.product_id) ===
          Number(product.id)
      );

    console.log(
      "FIELDS FOR THIS PRODUCT:",
      fieldsForProduct
    );

    console.log(
      "================================"
    );

    setSelectedProduct(product);
    setCustomValues({});
    setQuantity(1);
    setShowCustomizer(true);
  }

  // ==========================================
  // CLOSE
  // ==========================================

  function closeCustomizer() {
    setShowCustomizer(false);
    setSelectedProduct(null);
    setCustomValues({});
    setQuantity(1);
  }

  // ==========================================
  // FIELD CHANGE
  // ==========================================

  function handleFieldChange(
    fieldId,
    value
  ) {
    setCustomValues(
      (previous) => ({
        ...previous,
        [fieldId]: value,
      })
    );
  }

  // ==========================================
  // GET FIELDS FOR SELECTED PRODUCT
  // ==========================================

  const selectedProductFields =
    selectedProduct
      ? productFields.filter(
          (field) =>
            Number(field.product_id) ===
            Number(selectedProduct.id)
        )
      : [];

  // ==========================================
  // GET OPTIONS
  // ==========================================

  function getFieldOptions(fieldId) {
    return productFieldOptions.filter(
      (option) =>
        Number(option.field_id) ===
        Number(fieldId)
    );
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

 function handleAddToCart() {
  if (!selectedProduct) {
    return;
  }

  // Check required fields
  for (const field of selectedProductFields) {
    const value = customValues[field.id];

    if (
      field.required &&
      (!value || String(value).trim() === "")
    ) {
      alert(`${field.label} is required.`);
      return;
    }
  }

  const cartItem = {
    product_id: selectedProduct.id,
    name: selectedProduct.name,
    description: selectedProduct.description,
    base_price: Number(selectedProduct.base_price),
    image: selectedProduct.image,
    quantity: quantity,

    // Save the customer's customization
    custom_values: customValues,
  };

  console.log("ADDING TO CART:", cartItem);

  addToCart(cartItem);

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

  if (
    filteredProducts.length === 0
  ) {
    return (
      <div className="p-6 text-gray-500">
        No products found for{" "}
        {selectedCategory?.name ||
          "this category"}.
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      {/* PRODUCTS */}

      <div className="p-6 bg-white rounded-xl">

        <h2 className="text-xl font-bold mb-6 text-gray-800">
          {selectedCategory
            ? `${selectedCategory.name} Products`
            : "All Products"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredProducts.map(
            (product) => (

              <div
                key={product.id}
                className="
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                  flex
                  flex-col
                  justify-between
                  hover:shadow-md
                  transition
                  bg-white
                "
              >

                <div>

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

                  <h3 className="
                    text-lg
                    font-semibold
                    text-gray-900
                    mb-2
                  ">
                    {product.name}
                  </h3>

                  <p className="
                    text-sm
                    text-gray-600
                    line-clamp-2
                    mb-4
                  ">
                    {product.description ||
                      "No description available."}
                  </p>

                  <p className="
                    font-bold
                    text-purple-600
                    mb-4
                  ">
                    KSh{" "}
                    {product.base_price}
                  </p>

                </div>

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

            )
          )}

        </div>

      </div>

      {/* ========================================= */}
      {/* CUSTOMIZATION MODAL */}
      {/* ========================================= */}

      {showCustomizer &&
        selectedProduct && (

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

              {/* HEADER */}

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
                  ">
                    {selectedProduct.name}
                  </h2>

                  <p className="
                    text-purple-600
                    font-semibold
                  ">
                    KSh{" "}
                    {
                      selectedProduct.base_price
                    }
                  </p>

                </div>

                <button
                  onClick={
                    closeCustomizer
                  }
                  className="
                    text-gray-500
                    hover:text-black
                    text-3xl
                  "
                >
                  ×
                </button>

              </div>

              {/* IMAGE */}

              {selectedProduct.image && (
                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name
                  }
                  className="
                    w-full
                    h-56
                    object-cover
                  "
                />
              )}

              {/* CONTENT */}

              <div className="p-5">

                <h3 className="
                  font-bold
                  text-lg
                  mb-5
                ">
                  Customize your product
                </h3>

                {/* ================================= */}
                {/* NO FIELDS */}
                {/* ================================= */}

                {selectedProductFields.length ===
                  0 ? (

                  <div className="
                    bg-gray-50
                    rounded-lg
                    p-4
                    mb-5
                  ">

                    <p className="
                      text-gray-600
                    ">
                      This product has no customization
                      options.
                    </p>

                    {/* Useful debugging information */}

                    <p className="
                      text-xs
                      text-gray-400
                      mt-2
                    ">
                      Product ID:{" "}
                      {
                        selectedProduct.id
                      }
                    </p>

                  </div>

                ) : (

                  /* ================================= */
                  /* FIELDS */
                  /* ================================= */

                  <div className="space-y-5">

                    {selectedProductFields.map(
                      (field) => {

                        const fieldOptions =
                          getFieldOptions(
                            field.id
                          );

                        return (
                          <div
                            key={
                              field.id
                            }
                          >

                            <label className="
                              block
                              font-medium
                              mb-2
                              text-gray-800
                            ">

                              {
                                field.label
                              }

                              {field.required && (
                                <span className="
                                  text-red-500
                                  ml-1
                                ">
                                  *
                                </span>
                              )}

                            </label>

                            {/* DROPDOWN */}

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
                                  {field.placeholder ||
                                    `Select ${field.label}`}
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
                                      {
                                        option.value
                                      }
                                    </option>

                                  )
                                )}

                              </select>

                            )}

                            {/* TEXT */}

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

                            {/* NUMBER */}

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

                            {/* TEXTAREA */}

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

                            {/* NO DROPDOWN OPTIONS */}

                            {field.field_type ===
                              "dropdown" &&
                              fieldOptions.length ===
                                0 && (

                                <p className="
                                  text-sm
                                  text-red-500
                                  mt-2
                                ">
                                  No options have been
                                  configured for this field.
                                </p>

                              )}

                          </div>
                        );
                      }
                    )}

                  </div>

                )}

                {/* QUANTITY */}

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
                        rounded-lg
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
                        rounded-lg
                      "
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* ADD TO CART */}

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