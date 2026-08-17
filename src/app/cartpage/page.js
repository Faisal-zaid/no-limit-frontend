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

async function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone
  ) {
    alert("Please enter your name, email and phone number.");
    return;
  }

  try {
    setIsSubmitting(true);

    // ==========================================
    // STEP 1
    // CREATE THE MAIN ORDER
    // ==========================================

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

    const orderId = orderData.order_id;

    console.log("Created order:", orderId);

    // ==========================================
    // STEP 2
    // CREATE ORDER ITEMS
    // ==========================================

    for (const item of cart) {
      const itemResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orderitem`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
          }),
        }
      );

      if (!itemResponse.ok) {
        throw new Error(
          `Failed to create order item for ${item.name}`
        );
      }

      const itemData = await itemResponse.json();

      const orderItemId =
        itemData.order_item_id;

      console.log(
        "Created order item:",
        orderItemId
      );

      // ==========================================
      // STEP 3
      // SAVE CUSTOM VALUES
      // ==========================================

      const customValues =
        item.custom_values || {};

      for (const [fieldId, value] of Object.entries(
        customValues
      )) {
        // Don't create empty values
        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          continue;
        }

        const fieldResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orderitemfieldvalue`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              order_item_id: orderItemId,

              product_field_id:
                Number(fieldId),

              value: String(value),
            }),
          }
        );

        if (!fieldResponse.ok) {
          throw new Error(
            `Failed to save customization for ${item.name}`
          );
        }
      }
    }

    // ==========================================
    // STEP 4
    // ORDER SUCCESS
    // ==========================================

    alert(
      "Order received successfully! Please give the money to the owner."
    );

    clearCart();

    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");

  } catch (error) {
    console.error(error);

    alert(
      "Something went wrong while placing your order."
    );

  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <section className="min-h-screen bg-gray-50">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="bg-white shadow-md">

        <div className="flex items-center justify-between px-[3%] py-4">

          <Link href="/productspage">
            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit"
              width={77}
              height={75}
            />
          </Link>

          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart
          </h1>

          <Link
            href="/productspage"
            className="
              bg-purple-600
              hover:bg-purple-700
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Continue Shopping
          </Link>

        </div>

      </div>


      {/* ================================= */}
      {/* CART CONTENT */}
      {/* ================================= */}

      <div className="max-w-6xl mx-auto p-6">

        {cart.length === 0 ? (

          /* EMPTY CART */

          <div className="
            bg-white
            rounded-xl
            shadow-sm
            p-10
            text-center
          ">

            <div className="flex justify-center mb-5">
              <Image
                src="/images/Cart--Streamline-Platinum.png"
                alt="Empty cart"
                width={70}
                height={70}
              />
            </div>

            <h2 className="
              text-2xl
              font-bold
              text-gray-800
              mb-3
            ">
              Your cart is empty
            </h2>

            <p className="
              text-gray-500
              mb-6
            ">
              You haven't added anything to your cart yet.
            </p>

            <Link
              href="/productspage"
              className="
                inline-block
                bg-purple-600
                hover:bg-purple-700
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
              "
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ============================= */}
            {/* CART ITEMS */}
            {/* ============================= */}

            <div className="
              lg:col-span-2
              space-y-4
            ">

              {cart.map((item) => (

                <div
                  key={item.cart_id}
                  className="
                    bg-white
                    rounded-xl
                    shadow-sm
                    border
                    border-gray-200
                    p-5
                  "
                >

                  <div className="
                    flex
                    gap-5
                  ">

                    {/* IMAGE */}

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          w-28
                          h-28
                          object-cover
                          rounded-lg
                        "
                      />
                    )}


                    {/* PRODUCT DETAILS */}

                    <div className="flex-1">

                      <div className="
                        flex
                        justify-between
                        gap-4
                      ">

                        <div>

                          <h2 className="
                            text-lg
                            font-bold
                            text-gray-900
                          ">
                            {item.name}
                          </h2>

                          <p className="
                            text-purple-600
                            font-semibold
                            mt-1
                          ">
                            KSh {item.base_price}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.cart_id)
                          }
                          className="
                            text-red-500
                            hover:text-red-700
                            text-sm
                          "
                        >
                          Remove
                        </button>

                      </div>


                      {/* CUSTOMIZATION */}

                      {item.custom_values &&
                        Object.keys(item.custom_values).length > 0 && (

                        <div className="
                          mt-4
                          bg-gray-50
                          rounded-lg
                          p-3
                        ">

                          <p className="
                            font-semibold
                            text-sm
                            text-gray-700
                            mb-2
                          ">
                            Customization
                          </p>

                          <div className="space-y-1">

                            {Object.entries(
                              item.custom_values
                            ).map(
                              ([fieldId, value]) => (

                                <p
                                  key={fieldId}
                                  className="
                                    text-sm
                                    text-gray-600
                                  "
                                >
                                  Field {fieldId}:{" "}
                                  <span className="font-medium">
                                    {value}
                                  </span>
                                </p>

                              )
                            )}

                          </div>

                        </div>

                      )}


                      {/* QUANTITY */}

                      <div className="
                        flex
                        items-center
                        gap-4
                        mt-4
                      ">

                        <span className="
                          text-sm
                          font-medium
                        ">
                          Quantity:
                        </span>

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.cart_id
                            )
                          }
                          className="
                            w-8
                            h-8
                            border
                            rounded-lg
                            hover:bg-gray-100
                          "
                        >
                          −
                        </button>

                        <span className="
                          font-bold
                          min-w-[20px]
                          text-center
                        ">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.cart_id
                            )
                          }
                          className="
                            w-8
                            h-8
                            border
                            rounded-lg
                            hover:bg-gray-100
                          "
                        >
                          +
                        </button>

                      </div>


                      {/* ITEM TOTAL */}

                      <p className="
                        mt-4
                        text-right
                        font-bold
                        text-gray-900
                      ">
                        KSh{" "}
                        {Number(item.base_price) *
                          item.quantity}
                      </p>

                    </div>

                  </div>

                </div>

              ))}


              {/* CLEAR CART */}

              <button
                onClick={clearCart}
                className="
                  text-red-500
                  hover:text-red-700
                  text-sm
                "
              >
                Clear Cart
              </button>

            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">

  <h2 className="text-xl font-bold mb-5">
    Customer Information
  </h2>

  <div className="space-y-4">

    <div>
      <label className="block text-sm font-medium mb-1">
        Full Name
      </label>

      <input
        type="text"
        value={customerName}
        onChange={(e) =>
          setCustomerName(e.target.value)
        }
        placeholder="Enter your full name"
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Email
      </label>

      <input
        type="email"
        value={customerEmail}
        onChange={(e) =>
          setCustomerEmail(e.target.value)
        }
        placeholder="Enter your email"
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Phone Number
      </label>

      <input
        type="tel"
        value={customerPhone}
        onChange={(e) =>
          setCustomerPhone(e.target.value)
        }
        placeholder="07XXXXXXXX"
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>

  </div>

</div>


            {/* ============================= */}
            {/* ORDER SUMMARY */}
            {/* ============================= */}

            <div>

              <div className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                p-6
                sticky
                top-6
              ">

                <h2 className="
                  text-xl
                  font-bold
                  mb-6
                ">
                  Order Summary
                </h2>


                <div className="
                  flex
                  justify-between
                  text-gray-600
                  mb-3
                ">

                  <span>
                    Items
                  </span>

                  <span>
                    {cart.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )}
                  </span>

                </div>


                <div className="
                  border-t
                  pt-4
                  flex
                  justify-between
                  text-lg
                  font-bold
                ">

                  <span>
                    Total
                  </span>

                  <span className="text-purple-600">
                    KSh {cartTotal}
                  </span>

                </div>


                {/* GIVE MONEY TO OWNER */}

                <button
  onClick={placeOrder}
  disabled={isSubmitting}
  className="
    w-full
    mt-6
    bg-purple-600
    hover:bg-purple-700
    disabled:bg-gray-400
    text-white
    py-3
    rounded-lg
    font-semibold
    transition
  "
>
  {isSubmitting
    ? "Placing Order..."
    : "Give Money to Owner"}
</button>


                <p className="
                  text-xs
                  text-gray-500
                  text-center
                  mt-3
                ">
                  Payment will be made directly to the
                  owner.
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>
  );
}