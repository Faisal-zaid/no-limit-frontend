"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

// imports for react hook form and zod

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


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
          alt={value.name || "Custom uploaded image"}
          className="w-40 h-40 object-cover rounded-lg border border-gray-300"
        />

        <p className="text-purple-600 text-xs mt-2">
          📎 {value.name || "Uploaded image"}
        </p>
      </div>
    );
  }

  // ===================================================
  // OLD FILE OBJECT
  // ===================================================

  if (value instanceof File) {
    return <FilePreview file={value} />;
  }

  // ===================================================
  // NORMAL IMAGE URL
  // ===================================================

  if (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
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

  if (typeof value === "string" && value.startsWith("data:image/")) {
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

  return <span>{String(value)}</span>;
}

// =====================================================
// FILE PREVIEW
// =====================================================

function FilePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!(file instanceof File)) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) {
    return <span className="text-gray-500">Unable to preview image</span>;
  }

  return (
    <div className="mt-2">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-40 h-40 object-cover rounded-lg border border-gray-300"
      />

      <p className="text-purple-600 text-xs mt-2">📎 {file.name}</p>
    </div>
  );
}

// =====================================================
// CONVERT DATA URL BACK TO FILE
// =====================================================

async function dataURLToFile(dataUrl, fileName, mimeType) {
  const response = await fetch(dataUrl);

  const blob = await response.blob();

  return new File([blob], fileName || "uploaded-image", {
    type: mimeType || blob.type || "image/jpeg",
  });
}

const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
      "Name can only contain letters, spaces, apostrophes and hyphens"
    ),

  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(150, "Email is too long"),

  customerPhone: z
    .string()
    .trim()
    .regex(
      /^(?:07|01)\d{8}$/,
      "Enter a valid Kenyan phone number e.g. 0712345678"
    ),
});


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

  // ===================================================
  // CUSTOMER DETAILS
  // ===================================================

  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm({
  resolver: zodResolver(checkoutSchema),
  mode: "onBlur",
});


  // ===================================================
  // CHECKOUT STATE
  // ===================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===================================================
  // PAYMENT STATE
  // ===================================================

  const [paymentStatus, setPaymentStatus] = useState(null);

  const [currentOrderId, setCurrentOrderId] = useState(null);

  const [mpesaReceipt, setMpesaReceipt] = useState(null);

  const [paymentMessage, setPaymentMessage] = useState("");

  // =====================================================
  // POLL PAYMENT STATUS
  // =====================================================

  useEffect(() => {
    if (!currentOrderId) {
      return;
    }

    let attempts = 0;

    const maxAttempts = 60;

    const checkPaymentStatus = async () => {
      try {
        attempts++;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mpesa/payment-status/${currentOrderId}`,
        );

        const data = await response.json();

        console.log("PAYMENT STATUS:", data);

        if (!response.ok) {
          throw new Error(data.detail || "Unable to check payment status.");
        }

        // =============================================
        // PAYMENT SUCCESS
        // =============================================

        if (data.payment_status === "Paid") {
          setPaymentStatus("Paid");

          setMpesaReceipt(data.mpesa_receipt_number);

          setPaymentMessage("Payment received successfully!");

          setIsSubmitting(false);

          // Clear cart only AFTER payment succeeds
          clearCart();

          setCustomerName("");
          setCustomerEmail("");
          setCustomerPhone("");

          return;
        }

        // =============================================
        // PAYMENT FAILED
        // =============================================

        if (data.payment_status === "Failed") {
          setPaymentStatus("Failed");

          setPaymentMessage(
            "M-Pesa payment was cancelled or failed. Your cart has been kept.",
          );

          setIsSubmitting(false);

          return;
        }

        // =============================================
        // TIMEOUT
        // =============================================

        if (attempts >= maxAttempts) {
          setPaymentStatus("Timeout");

          setPaymentMessage(
            "We could not confirm your payment. Please check your M-Pesa messages before trying again.",
          );

          setIsSubmitting(false);

          return;
        }

        // =============================================
        // STILL PENDING
        // =============================================

        setPaymentStatus("Pending");

        setPaymentMessage("Waiting for M-Pesa payment confirmation...");

        setTimeout(checkPaymentStatus, 3000);
      } catch (error) {
        console.error("PAYMENT STATUS ERROR:", error);

        setPaymentMessage("Unable to check payment status. Please wait...");

        if (attempts < maxAttempts) {
          setTimeout(checkPaymentStatus, 3000);
        } else {
          setIsSubmitting(false);
        }
      }
    };

    checkPaymentStatus();

    // No cleanup needed for the simple timeout chain.
  }, [currentOrderId, clearCart]);

  // =====================================================
  // PLACE ORDER
  // =====================================================

  async function placeOrder(formData) {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    setIsSubmitting(true);

    const customerName = formData.customerName;
    const customerEmail = formData.customerEmail;
    const customerPhone = formData.customerPhone;

    // your existing checkout code continues here...

      setIsSubmitting(true);

      setPaymentStatus(null);
      setPaymentMessage("");
      setMpesaReceipt(null);
      setCurrentOrderId(null);

      // =================================================
      // PREPARE CHECKOUT ITEMS
      // =================================================

      const checkoutItems = [];

      // =================================================
      // PROCESS EACH CART ITEM
      // =================================================

      for (const item of cart) {
        const customValues = item.custom_values || {};

        const fields = [];

        // =================================================
        // PROCESS CUSTOM VALUES
        // =================================================

        for (const [fieldId, value] of Object.entries(customValues)) {
          // -----------------------------------------------
          // IGNORE EMPTY VALUES
          // -----------------------------------------------

          if (value === null || value === undefined || value === "") {
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
            console.log("UPLOADING CUSTOM IMAGE:", value.name);

            const imageFile = await dataURLToFile(
              value.dataUrl,
              value.name,
              value.mimeType,
            );

            const imageFormData = new FormData();

            imageFormData.append("image", imageFile);

            const imageResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/upload-custom-image`,
              {
                method: "POST",
                body: imageFormData,
              },
            );

            const imageData = await imageResponse.json();

            if (!imageResponse.ok) {
              console.error("CUSTOM IMAGE UPLOAD FAILED:", imageData);

              throw new Error(
                imageData.detail || `Failed to upload image for ${item.name}`,
              );
            }

            console.log("CUSTOM IMAGE UPLOADED:", imageData.image_url);

            fields.push({
              product_field_id: Number(fieldId),

              value: imageData.image_url,
            });

            continue;
          }

          // =================================================
          // OLD FILE OBJECT
          // =================================================

          if (value instanceof File) {
            console.log("UPLOADING FILE:", value.name);

            const imageFormData = new FormData();

            imageFormData.append("image", value);

            const imageResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/upload-custom-image`,
              {
                method: "POST",
                body: imageFormData,
              },
            );

            const imageData = await imageResponse.json();

            if (!imageResponse.ok) {
              console.error("CUSTOM IMAGE UPLOAD FAILED:", imageData);

              throw new Error(
                imageData.detail || `Failed to upload image for ${item.name}`,
              );
            }

            fields.push({
              product_field_id: Number(fieldId),

              value: imageData.image_url,
            });

            continue;
          }

          // =================================================
          // NORMAL VALUE
          // =================================================

          fields.push({
            product_field_id: Number(fieldId),

            value: String(value),
          });
        }

        // =================================================
        // ADD ITEM TO CHECKOUT
        // =================================================

        checkoutItems.push({
          product_id: Number(item.product_id),

          quantity: Number(item.quantity),

          fields,
        });
      }

      console.log("CHECKOUT ITEMS:", checkoutItems);

      // =================================================
      // CREATE ORDER
      // =================================================

      const checkoutResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_name: customerName.trim(),

            customer_email: customerEmail.trim(),

            customer_phone: customerPhone.trim(),

            items: checkoutItems,
          }),
        },
      );

      const checkoutData = await checkoutResponse.json();

      console.log("CHECKOUT RESPONSE:", checkoutData);

      // =================================================
      // CHECK CHECKOUT RESPONSE
      // =================================================

      if (!checkoutResponse.ok) {
        throw new Error(checkoutData.detail || "Checkout failed.");
      }

      const orderId = checkoutData.order_id;

      if (!orderId) {
        throw new Error("Order was created but no order ID was returned.");
      }

      console.log("ORDER CREATED:", orderId);

      setCurrentOrderId(orderId);

      // =================================================
      // SEND M-PESA STK PUSH
      // =================================================

      setPaymentStatus("Sending");

      setPaymentMessage("Sending M-Pesa payment request...");

      const mpesaResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mpesa/stkpush`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            order_id: orderId,

            phone_number: customerPhone.trim(),
          }),
        },
      );

      const mpesaData = await mpesaResponse.json();

      console.log("M-PESA RESPONSE:", mpesaData);

      // =================================================
      // CHECK M-PESA RESPONSE
      // =================================================

      if (!mpesaResponse.ok) {
        throw new Error(mpesaData.detail || "Could not start M-Pesa payment.");
      }

      // =================================================
      // STK PUSH SENT
      // =================================================

      setPaymentStatus("Pending");

      setPaymentMessage(
        mpesaData.message || "Check your phone and enter your M-Pesa PIN.",
      );

      console.log("STK PUSH SENT SUCCESSFULLY");
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      setPaymentStatus("Failed");

      setPaymentMessage(
        error.message || "Something went wrong while placing the order.",
      );

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

          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>

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
        {cart.length === 0 && !paymentStatus ? (
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
                  disabled={isSubmitting}
                  className="text-sm text-red-500 hover:text-red-700 disabled:text-gray-400 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
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
                            KSh {item.base_price}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cart_id)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      {/* ================================= */}
                      {/* CUSTOMIZATIONS */}
                      {/* ================================= */}

                      {item.custom_values &&
                        Object.keys(item.custom_values).length > 0 && (
                          <div className="mt-4 bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                              Customizations
                            </p>

                            <div className="space-y-4">
                              {Object.entries(item.custom_values).map(
                                ([fieldId, value]) => (
                                  <div
                                    key={fieldId}
                                    className="text-sm text-gray-600"
                                  >
                                    <p className="font-medium">
                                      Field #{fieldId}
                                    </p>

                                    <div className="mt-1 text-gray-800">
                                      <CustomValuePreview value={value} />
                                    </div>
                                  </div>
                                ),
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
                            onClick={() => decreaseQuantity(item.cart_id)}
                            disabled={isSubmitting}
                            className="px-3 py-1 hover:bg-gray-200 disabled:bg-gray-100 text-gray-600 font-bold"
                          >
                            -
                          </button>

                          <span className="px-4 py-1 text-sm font-semibold text-gray-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.cart_id)}
                            disabled={isSubmitting}
                            className="px-3 py-1 hover:bg-gray-200 disabled:bg-gray-100 text-gray-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* =========================================== */}
            {/* CHECKOUT */}
            {/* =========================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-6">
              {/* ========================================= */}
              {/* PAYMENT SUCCESS */}
              {/* ========================================= */}

              {paymentStatus === "Paid" ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">✓</div>

                  <h2 className="text-2xl font-bold text-green-600">
                    Payment Successful
                  </h2>

                  <p className="text-gray-600 mt-3">
                    Your order has been received and is now being processed.
                  </p>

                  {currentOrderId && (
                    <p className="text-sm text-gray-500 mt-4">
                      Order #{currentOrderId}
                    </p>
                  )}

                  {mpesaReceipt && (
                    <p className="text-sm text-gray-500 mt-1">
                      M-Pesa Receipt:{" "}
                      <span className="font-semibold">{mpesaReceipt}</span>
                    </p>
                  )}

                  <Link
                    href="/productspage"
                    className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : paymentStatus === "Pending" || paymentStatus === "Sending" ? (
                /* ======================================= */
                /* WAITING FOR PAYMENT */
                /* ======================================= */

                <div className="text-center py-6">
                  <div className="text-5xl mb-4"></div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    M-Pesa Payment
                  </h2>

                  <p className="text-purple-600 font-semibold mt-3">
                    {paymentMessage}
                  </p>

                  <div className="mt-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-purple-600 mx-auto"></div>
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    Please don't close this page while we wait for confirmation.
                  </p>

                  {currentOrderId && (
                    <p className="text-xs text-gray-400 mt-4">
                      Order #{currentOrderId}
                    </p>
                  )}
                </div>
              ) : paymentStatus === "Failed" || paymentStatus === "Timeout" ? (
                /* ======================================= */
                /* PAYMENT FAILED */
                /* ======================================= */

                <div className="text-center py-6">
                  <div className="text-5xl mb-4">
                    {paymentStatus === "Timeout" ? "" : ""}
                  </div>

                  <h2 className="text-2xl font-bold text-red-600">
                    {paymentStatus === "Timeout"
                      ? "Payment Not Confirmed"
                      : "Payment Failed"}
                  </h2>

                  <p className="text-gray-600 mt-3">{paymentMessage}</p>

                  <button
                    onClick={() => {
                      setPaymentStatus(null);
                      setCurrentOrderId(null);
                      setPaymentMessage("");
                      setMpesaReceipt(null);
                    }}
                    className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                /* ======================================= */
                /* NORMAL CHECKOUT */
                /* ======================================= */

                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Order Summary
                  </h2>

                  <form onSubmit={handleSubmit(placeOrder)} className="space-y-4">

                    {/* NAME */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>

                      <input
  type="text"
  placeholder="John Doe"
  disabled={isSubmitting}
  {...register("customerName")}
  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
/>

{errors.customerName && (
  <p className="text-red-500 text-xs mt-1">
    {errors.customerName.message}
  </p>
)}

                    </div>

                    {/* EMAIL */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>

                      <input
  type="email"
  placeholder="john@example.com"
  disabled={isSubmitting}
  {...register("customerEmail")}
  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
/>

{errors.customerEmail && (
  <p className="text-red-500 text-xs mt-1">
    {errors.customerEmail.message}
  </p>
)}

                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        M-Pesa Phone Number
                      </label>

                      <input
  type="tel"
  inputMode="numeric"
  placeholder="0712345678"
  disabled={isSubmitting}
  {...register("customerPhone")}
  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
/>

{errors.customerPhone && (
  <p className="text-red-500 text-xs mt-1">
    {errors.customerPhone.message}
  </p>
)}

<p className="text-xs text-gray-500 mt-1">
  Enter a Kenyan number e.g. 0712345678.
</p>


                      <p className="text-xs text-gray-500 mt-1">
                        You'll receive the M-Pesa payment prompt on this number.
                      </p>
                    </div>

                    {/* TOTAL */}

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-base font-bold text-gray-900">
                        <span>Total Amount</span>

                        <span className="text-purple-600">KSh {cartTotal}</span>
                      </div>
                    </div>

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 rounded-lg transition"
                    >
                      {isSubmitting
                        ? "Starting M-Pesa Payment..."
                        : "Pay with M-Pesa"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
