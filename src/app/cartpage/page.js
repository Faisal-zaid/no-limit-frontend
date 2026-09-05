
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

// =====================================================
// CUSTOM VALUE PREVIEW
// =====================================================

function CustomValuePreview({ value }) {
  // ===================================================
  // NEW IMAGE OBJECT
  // ===================================================

  if (
    value &&
    typeof value === "object" &&
    value.type === "image" &&
    value.dataUrl
  ) {
    return (
      <div className="mt-2">
        <img
          src={value.dataUrl}
          alt={
            value.name ||
            "Custom uploaded image"
          }
          className="w-40 h-40 object-cover rounded-lg border border-gray-300"
        />

        <p className="text-purple-600 text-xs mt-2">
          📎{" "}
          {value.name ||
            "Uploaded image"}
        </p>
      </div>
    );
  }

  // ===================================================
  // OLD FILE OBJECT
  // ===================================================

  if (value instanceof File) {
    return (
      <FilePreview file={value} />
    );
  }

  // ===================================================
  // NORMAL IMAGE URL
  // ===================================================

  if (
    typeof value === "string" &&
    (value.startsWith("http://") ||
      value.startsWith("https://"))
  ) {
    return (
      <div className="mt-2">
        <img
          src={value}
          alt="Custom upload"
          className="w-40 h-40 object-cover rounded-lg border border-gray-300"
        />

        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="block text-purple-600 underline text-xs mt-2"
        >
          View full image
        </a>
      </div>
    );
  }

  // ===================================================
  // DATA URL
  // ===================================================

  if (
    typeof value === "string" &&
    value.startsWith("data:image/")
  ) {
    return (
      <div className="mt-2">
        <img
          src={value}
          alt="Custom upload"
          className="w-40 h-40 object-cover rounded-lg border border-gray-300"
        />
      </div>
    );
  }

  // ===================================================
  // NORMAL VALUE
  // ===================================================

  return (
    <span>
      {String(value)}
    </span>
  );
}

// =====================================================
// FILE PREVIEW
// =====================================================

function FilePreview({ file }) {
  const [
    previewUrl,
    setPreviewUrl,
  ] = useState(null);

  useEffect(() => {
    if (!(file instanceof File)) {
      setPreviewUrl(null);
      return;
    }

    const url =
      URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) {
    return (
      <span className="text-gray-500">
        Unable to preview image
      </span>
    );
  }

  return (
    <div className="mt-2">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-40 h-40 object-cover rounded-lg border border-gray-300"
      />

      <p className="text-purple-600 text-xs mt-2">
        📎 {file.name}
      </p>
    </div>
  );
}

// =====================================================
// CONVERT DATA URL BACK TO FILE
// =====================================================

async function dataURLToFile(
  dataUrl,
  fileName,
  mimeType
) {
  const response =
    await fetch(dataUrl);

  const blob =
    await response.blob();

  return new File(
    [blob],
    fileName ||
      "uploaded-image",
    {
      type:
        mimeType ||
        blob.type ||
        "image/jpeg",
    }
  );
}

// =====================================================
// CART PAGE
// =====================================================

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  
// =====================================================
// PLACE ORDER
// =====================================================

async function placeOrder(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (
    !customerName.trim() ||
    !customerEmail.trim() ||
    !customerPhone.trim()
  ) {
    alert(
      "Please fill in all customer details."
    );
    return;
  }

  try {
    setIsSubmitting(true);

    // =================================================
    // PREPARE CHECKOUT ITEMS
    // =================================================

    const checkoutItems = [];

    // =================================================
    // PROCESS EACH CART ITEM
    // =================================================

    for (const item of cart) {
      const customValues =
        item.custom_values || {};

      const fields = [];

      // =================================================
      // PROCESS CUSTOM VALUES
      // =================================================

      for (const [
        fieldId,
        value
      ] of Object.entries(
        customValues
      )) {

        // -----------------------------------------------
        // IGNORE EMPTY VALUES
        // -----------------------------------------------

        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          continue;
        }

        // =================================================
        // NEW IMAGE OBJECT
        // =================================================

        if (
          value &&
          typeof value === "object" &&
          value.type === "image" &&
          value.dataUrl
        ) {

          console.log(
            "UPLOADING CUSTOM IMAGE:",
            value.name
          );

          // ---------------------------------------------
          // Convert data URL → File
          // ---------------------------------------------

          const imageFile =
            await dataURLToFile(
              value.dataUrl,
              value.name,
              value.mimeType
            );

          // ---------------------------------------------
          // FormData
          // ---------------------------------------------

          const imageFormData =
            new FormData();

          imageFormData.append(
            "image",
            imageFile
          );

          // ---------------------------------------------
          // Upload to backend
          // ---------------------------------------------

          const imageResponse =
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/upload-custom-image`,
              {
                method: "POST",
                body: imageFormData
              }
            );

          const imageData =
            await imageResponse.json();

          if (!imageResponse.ok) {

            console.error(
              "CUSTOM IMAGE UPLOAD FAILED:",
              imageData
            );

            throw new Error(
              imageData.detail ||
              `Failed to upload image for ${item.name}`
            );
          }

          console.log(
            "CUSTOM IMAGE UPLOADED:",
            imageData.image_url
          );

          // ---------------------------------------------
          // Save Cloudinary URL as field value
          // ---------------------------------------------

          fields.push({
            product_field_id:
              Number(fieldId),

            value:
              imageData.image_url
          });

          continue;
        }

        // =================================================
        // OLD FILE OBJECT
        // =================================================

        if (
          value instanceof File
        ) {

          console.log(
            "UPLOADING FILE:",
            value.name
          );

          const imageFormData =
            new FormData();

          imageFormData.append(
            "image",
            value
          );

          const imageResponse =
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/upload-custom-image`,
              {
                method: "POST",
                body: imageFormData
              }
            );

          const imageData =
            await imageResponse.json();

          if (!imageResponse.ok) {

            console.error(
              "CUSTOM IMAGE UPLOAD FAILED:",
              imageData
            );

            throw new Error(
              imageData.detail ||
              `Failed to upload image for ${item.name}`
            );
          }

          fields.push({
            product_field_id:
              Number(fieldId),

            value:
              imageData.image_url
          });

          continue;
        }

        // =================================================
        // NORMAL VALUE
        // =================================================

        fields.push({
          product_field_id:
            Number(fieldId),

          value:
            String(value)
        });
      }

      // =================================================
      // ADD ITEM TO CHECKOUT
      // =================================================

      checkoutItems.push({
        product_id:
          Number(item.product_id),

        quantity:
          Number(item.quantity),

        fields
      });
    }

    console.log(
      "CHECKOUT ITEMS:",
      checkoutItems
    );

    // =================================================
    // SEND ONE CHECKOUT REQUEST
    // =================================================

    const checkoutResponse =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            customer_name:
              customerName.trim(),

            customer_email:
              customerEmail.trim(),

            customer_phone:
              customerPhone.trim(),

            items:
              checkoutItems
          })
        }
      );

    const checkoutData =
      await checkoutResponse.json();

    console.log(
      "CHECKOUT RESPONSE:",
      checkoutData
    );

    // =================================================
    // CHECK RESPONSE
    // =================================================

    if (!checkoutResponse.ok) {

      alert(
        checkoutData.detail ||
        "Checkout failed."
      );

      return;
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "ORDER CREATED:",
      checkoutData.order_id
    );

    alert(
      "Order placed successfully! We will contact you soon."
    );

    // =================================================
    // CLEAR CART
    // =================================================

    clearCart();

    // =================================================
    // CLEAR CUSTOMER DETAILS
    // =================================================

    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");

  } catch (error) {

    console.error(
      "CHECKOUT ERROR:",
      error
    );

    alert(
      error.message ||
      "Something went wrong while placing the order. Please try again."
    );

  } finally {

    setIsSubmitting(false);

  }
}



  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="min-h-screen bg-gray-50 pb-12">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="bg-white shadow-sm border-b">

        <div className="flex items-center justify-between px-[5%] py-4 max-w-7xl mx-auto">

          <Link href="/productspage">

            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit"
              width={77}
              height={75}
              className="h-auto w-auto"
            />

          </Link>

          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart
          </h1>

          <Link
            href="/productspage"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="max-w-7xl mx-auto p-6 mt-6">

        {cart.length === 0 ? (

          /* ============================================= */
          /* EMPTY CART */
          /* ============================================= */

          <div className="bg-white rounded-xl shadow-sm border p-12 text-center max-w-md mx-auto">

            <div className="flex justify-center mb-5">

              <Image
                src="/images/Cart--Streamline-Platinum.png"
                alt="Empty cart"
                width={70}
                height={70}
              />

            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              You haven't added any custom items to your cart yet.
            </p>

            <Link
              href="/productspage"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          /* ============================================= */
          /* ACTIVE CART */
          /* ============================================= */

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* =========================================== */}
            {/* CART ITEMS */}
            {/* =========================================== */}

            <div className="lg:col-span-2 space-y-4">

              <div className="flex justify-between items-center mb-2">

                <h2 className="text-xl font-bold text-gray-800">
                  Items ({cart.length})
                </h2>

                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>

              </div>


              {cart.map(
                (item) => (

                  <div
                    key={item.cart_id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                  >

                    <div className="flex gap-5">

                      {/* PRODUCT IMAGE */}

                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                        />
                      )}


                      {/* DETAILS */}

                      <div className="flex-1">

                        <div className="flex justify-between items-start gap-4">

                          <div>

                            <h3 className="text-lg font-bold text-gray-900">
                              {item.name}
                            </h3>

                            <p className="text-purple-600 font-semibold mt-1">
                              KSh{" "}
                              {item.base_price}
                            </p>

                          </div>


                          <button
                            onClick={() =>
                              removeFromCart(
                                item.cart_id
                              )
                            }
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>

                        </div>


                        {/* ================================= */}
                        {/* CUSTOMIZATIONS */}
                        {/* ================================= */}

                        {item.custom_values &&
                          Object.keys(
                            item.custom_values
                          ).length > 0 && (

                            <div className="mt-4 bg-gray-50 rounded-lg p-4">

                              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                                Customizations
                              </p>


                              <div className="space-y-4">

                                {Object.entries(
                                  item.custom_values
                                ).map(
                                  ([
                                    fieldId,
                                    value,
                                  ]) => (

                                    <div
                                      key={
                                        fieldId
                                      }
                                      className="text-sm text-gray-600"
                                    >

                                      <p className="font-medium">
                                        Field #
                                        {
                                          fieldId
                                        }
                                      </p>


                                      <div className="mt-1 text-gray-800">

                                        <CustomValuePreview
                                          value={
                                            value
                                          }
                                        />

                                      </div>

                                    </div>

                                  )
                                )}

                              </div>

                            </div>

                          )}


                        {/* ================================= */}
                        {/* QUANTITY */}
                        {/* ================================= */}

                        <div className="flex items-center gap-3 mt-4">

                          <span className="text-sm font-medium text-gray-700">
                            Quantity:
                          </span>


                          <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.cart_id
                                )
                              }
                              className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold"
                            >
                              -
                            </button>


                            <span className="px-4 py-1 text-sm font-semibold text-gray-800">
                              {
                                item.quantity
                              }
                            </span>


                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.cart_id
                                )
                              }
                              className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold"
                            >
                              +
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>


            {/* =========================================== */}
            {/* CHECKOUT */}
            {/* =========================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-6">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>


              <form
                onSubmit={placeOrder}
                className="space-y-4"
              >

                {/* NAME */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      customerName
                    }
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                    placeholder="John Doe"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={
                      customerEmail
                    }
                    onChange={(e) =>
                      setCustomerEmail(
                        e.target.value
                      )
                    }
                    placeholder="john@example.com"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                </div>


                {/* PHONE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    required
                    value={
                      customerPhone
                    }
                    onChange={(e) =>
                      setCustomerPhone(
                        e.target.value
                      )
                    }
                    placeholder="0712345678"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                </div>


                {/* TOTAL */}

                <div className="border-t pt-4 mt-4">

                  <div className="flex justify-between text-base font-bold text-gray-900">

                    <span>
                      Total Amount
                    </span>

                    <span className="text-purple-600">
                      KSh{" "}
                      {cartTotal}
                    </span>

                  </div>

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 rounded-lg transition"
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </section>
  );
}

