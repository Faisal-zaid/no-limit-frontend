"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function placeOrder(e) {
    e?.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please fill in all customer details.");
      return;
    }

    try {
      setIsSubmitting(true);

      // STEP 1: CREATE MAIN ORDER
      const orderResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/order`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      status: "Pending",
      total_price: cartTotal,
    }),
  }
);

if (!orderResponse.ok) {
  throw new Error("Failed to create order");
}

const orderData = await orderResponse.json();

console.log("ORDER CREATED:", orderData);

const orderId = orderData.order_id;

      // STEP 2 & 3: CREATE ORDER ITEMS & CUSTOM VALUES
      for (const item of cart) {

        const orderItemData = {
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
  };

  console.log("SENDING ORDER ITEM:", orderItemData);


 console.log("SENDING ORDER ITEM:", {
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
  });


         const itemResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orderitem`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderItemData),
    }
  );
        if (!itemResponse.ok) {
          throw new Error(`Failed to create order item for ${item.name}`);
        }

        const itemData = await itemResponse.json();
        const orderItemId = itemData.order_item_id || itemData.id;

        // Save Customization Values
        const customValues = item.custom_values || {};
        for (const [fieldId, value] of Object.entries(customValues)) {
          if (value === null || value === undefined || value === "") continue;

          const fieldResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orderitemfieldvalue`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_item_id: orderItemId,
                product_field_id: Number(fieldId),
                value: String(value),
              }),
            }
          );

          if (!fieldResponse.ok) {
            throw new Error(`Failed to save customization for ${item.name}`);
          }
        }
      }

      // STEP 4: SUCCESS & RESET
      alert("Order placed successfully! We will contact you soon.");
      clearCart();
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-[5%] py-4 max-w-7xl mx-auto">
          <Link href="/productspage">
            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit"
              width={77}
              height={75}
              className="h-auto w-auto" // Added to fix the console warning
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

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-6 mt-6">
        {cart.length === 0 ? (
          /* EMPTY CART STATE */
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
          /* ACTIVE CART & CHECKOUT */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS LIST */}
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

              {cart.map((item) => (
                <div
                  key={item.cart_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                >
                  <div className="flex gap-5">
                    {/* Item Image */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                      />
                    )}

                    {/* Details */}
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
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Customizations */}
                      {item.custom_values &&
                        Object.keys(item.custom_values).length > 0 && (
                          <div className="mt-3 bg-gray-50 rounded-lg p-3">
                            <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-1">
                              Customizations
                            </p>
                            <div className="space-y-1">
                              {Object.entries(item.custom_values).map(
                                ([fieldId, value]) => (
                                  <p
                                    key={fieldId}
                                    className="text-sm text-gray-600"
                                  >
                                    Field #{fieldId}:{" "}
                                    <span className="font-medium text-gray-800">
                                      {typeof value === "string" &&
                                      value.startsWith("http") ? (
                                        <a
                                          href={value}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-purple-600 underline"
                                        >
                                          View Upload
                                        </a>
                                      ) : (
                                        value
                                      )}
                                    </span>
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm font-medium text-gray-700">
                          Quantity:
                        </span>
                        <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => decreaseQuantity(item.cart_id)}
                            className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.cart_id)}
                            className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold"
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

            {/* CHECKOUT FORM & SUMMARY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <form onSubmit={placeOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-purple-600">KSh {cartTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 rounded-lg transition"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}