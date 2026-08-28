"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

// ======================================================
// CUSTOM VALUE PREVIEW
// Handles:
// - File objects
// - Image URLs
// - Objects containing File/image/url/preview/image_url
// - Normal text, numbers, dropdowns, etc.
// ======================================================

function CustomValuePreview({ value }) {
const [previewUrl, setPreviewUrl] = useState(null);
const [fileName, setFileName] = useState("");

useEffect(() => {
let objectUrl = null;


setPreviewUrl(null);
setFileName("");

// ==========================================
// 1. VALUE IS DIRECTLY A FILE
// ==========================================

if (value instanceof File) {
  objectUrl = URL.createObjectURL(value);

  setPreviewUrl(objectUrl);
  setFileName(value.name);

  return () => {
    URL.revokeObjectURL(objectUrl);
  };
}

// ==========================================
// 2. VALUE IS A DIRECT IMAGE URL
// ==========================================

if (
  typeof value === "string" &&
  (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:image")
  )
) {
  setPreviewUrl(value);
  return;
}

// ==========================================
// 3. VALUE IS AN OBJECT
// ==========================================

if (typeof value === "object" && value !== null) {
  // Object contains .file
  if (value.file instanceof File) {
    objectUrl = URL.createObjectURL(value.file);

    setPreviewUrl(objectUrl);
    setFileName(value.file.name);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }

  // Object contains .image
  if (value.image instanceof File) {
    objectUrl = URL.createObjectURL(value.image);

    setPreviewUrl(objectUrl);
    setFileName(value.image.name);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }

  // Object contains .url
  if (
    typeof value.url === "string" &&
    value.url
  ) {
    setPreviewUrl(value.url);

    if (value.name) {
      setFileName(value.name);
    }

    return;
  }

  // Object contains .preview
  if (
    typeof value.preview === "string" &&
    value.preview
  ) {
    setPreviewUrl(value.preview);

    if (value.name) {
      setFileName(value.name);
    }

    return;
  }

  // Object contains .image_url
  if (
    typeof value.image_url === "string" &&
    value.image_url
  ) {
    setPreviewUrl(value.image_url);

    if (value.name) {
      setFileName(value.name);
    }

    return;
  }
}


}, [value]);

// ==========================================
// SHOW IMAGE
// ==========================================

if (previewUrl) {
return ( <div className="mt-2"> <img
       src={previewUrl}
       alt="Custom upload"
       className="w-40 h-40 object-cover rounded-lg border border-gray-300"
     />


    {fileName && (
      <p className="text-purple-600 text-xs mt-2">
        📎 {fileName}
      </p>
    )}
  </div>
);


}

// ==========================================
// NORMAL TEXT / NUMBER / DROPDOWN
// ==========================================

if (
typeof value === "string" ||
typeof value === "number"
) {
return ( <span>
{String(value)} </span>
);
}

// ==========================================
// UNKNOWN OBJECT
// ==========================================

if (typeof value === "object" && value !== null) {
return ( <span className="text-red-500 italic">
Unable to preview image </span>
);
}

return ( <span>
{String(value)} </span>
);
}

// ======================================================
// CART PAGE
// ======================================================

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

// ======================================================
// PLACE ORDER
// ======================================================

async function placeOrder(e) {
e.preventDefault();


if (cart.length === 0) {
  alert("Your cart is empty.");
  return;
}

if (
  !customerName ||
  !customerEmail ||
  !customerPhone
) {
  alert(
    "Please fill in all customer details."
  );

  return;
}

try {
  setIsSubmitting(true);

  // ==================================================
  // STEP 1: CREATE MAIN ORDER
  // ==================================================

  const orderResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/order`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        customer_name:
          customerName,

        customer_email:
          customerEmail,

        customer_phone:
          customerPhone,

        status:
          "Pending",

        total_price:
          cartTotal,
      }),
    }
  );

  if (!orderResponse.ok) {
    const errorData =
      await orderResponse.json();

    console.error(
      "ORDER CREATION FAILED:",
      errorData
    );

    throw new Error(
      "Failed to create order"
    );
  }

  const orderData =
    await orderResponse.json();

  console.log(
    "ORDER CREATED:",
    orderData
  );

  const orderId =
    orderData.order_id ||
    orderData.id;

  if (!orderId) {
    throw new Error(
      "Order ID was not returned."
    );
  }

  // ==================================================
  // STEP 2: CREATE ORDER ITEMS
  // ==================================================

  for (const item of cart) {
    const orderItemData = {
      order_id:
        orderId,

      product_id:
        item.product_id,

      quantity:
        item.quantity,
    };

    console.log(
      "SENDING ORDER ITEM:",
      orderItemData
    );

    const itemResponse =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orderitem`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              orderItemData
            ),
        }
      );

    if (!itemResponse.ok) {
      const errorData =
        await itemResponse.json();

      console.error(
        "ORDER ITEM FAILED:",
        errorData
      );

      throw new Error(
        `Failed to create order item for ${item.name}`
      );
    }

    const itemData =
      await itemResponse.json();

    const orderItemId =
      itemData.order_item_id ||
      itemData.id;

    if (!orderItemId) {
      throw new Error(
        `Order item ID was not returned for ${item.name}`
      );
    }

    // ==================================================
    // STEP 3: SAVE CUSTOMIZATION VALUES
    // ==================================================

    const customValues =
      item.custom_values || {};

    console.log(
      "CUSTOM VALUES:",
      customValues
    );

    for (
      const [fieldId, value]
      of Object.entries(
        customValues
      )
    ) {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        continue;
      }

      console.log(
        "PROCESSING FIELD:",
        fieldId,
        value
      );

      // ==============================================
      // GET FILE IF VALUE IS FILE OR OBJECT
      // ==============================================

      let imageFile = null;

      if (value instanceof File) {
        imageFile = value;
      } else if (
        typeof value === "object" &&
        value !== null
      ) {
        if (
          value.file instanceof File
        ) {
          imageFile =
            value.file;
        } else if (
          value.image instanceof File
        ) {
          imageFile =
            value.image;
        }
      }

      // ==============================================
      // IMAGE UPLOAD
      // ==============================================

      if (imageFile) {
        const imageFormData =
          new FormData();

        imageFormData.append(
          "order_item_id",
          String(orderItemId)
        );

        imageFormData.append(
          "product_field_id",
          String(fieldId)
        );

        imageFormData.append(
          "image",
          imageFile
        );

        const imageResponse =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orderitemfieldvalue/image`,
            {
              method:
                "POST",

              body:
                imageFormData,
            }
          );

        const imageData =
          await imageResponse.json();

        if (!imageResponse.ok) {
          console.error(
            "IMAGE UPLOAD FAILED:",
            imageData
          );

          throw new Error(
            `Failed to upload image for ${item.name}`
          );
        }

        console.log(
          "IMAGE UPLOADED:",
          imageData
        );
      }

      // ==============================================
      // NORMAL FIELD VALUE
      // ==============================================

      else {
        // If the value is an object with an image URL,
        // extract the URL instead of sending [object Object]

        let finalValue = value;

        if (
          typeof value === "object" &&
          value !== null
        ) {
          finalValue =
            value.url ||
            value.preview ||
            value.image_url ||
            value.name ||
            "";
        }

        if (!finalValue) {
          continue;
        }

        const fieldResponse =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/orderitemfieldvalue`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  order_item_id:
                    orderItemId,

                  product_field_id:
                    Number(
                      fieldId
                    ),

                  value:
                    String(
                      finalValue
                    ),
                }),
            }
          );

        const fieldData =
          await fieldResponse.json();

        if (
          !fieldResponse.ok
        ) {
          console.error(
            "CUSTOMIZATION FAILED:",
            fieldData
          );

          throw new Error(
            `Failed to save customization for ${item.name}`
          );
        }

        console.log(
          "FIELD SAVED:",
          fieldData
        );
      }
    }
  }

  // ==================================================
  // SUCCESS
  // ==================================================

  alert(
    "Order placed successfully! We will contact you soon."
  );

  clearCart();

  setCustomerName("");
  setCustomerEmail("");
  setCustomerPhone("");
} catch (error) {
  console.error(
    "ORDER ERROR:",
    error
  );

  alert(
    "Something went wrong while placing your order. Please try again."
  );
} finally {
  setIsSubmitting(false);
}


}

// ======================================================
// UI
// ======================================================

return ( <section className="min-h-screen bg-gray-50 pb-12">


  {/* HEADER */}

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

  {/* CONTENT */}

  <div className="max-w-7xl mx-auto p-6 mt-6">

    {cart.length === 0 ? (

      /* EMPTY CART */

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CART ITEMS */}

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

                  {/* CUSTOMIZATIONS */}

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
                            (
                              [
                                fieldId,
                                value,
                              ]
                            ) => (

                              <div
                                key={
                                  fieldId
                                }
                                className="text-sm text-gray-600"
                              >

                                <p className="font-medium text-gray-700 mb-1">
                                  Field #
                                  {fieldId}
                                </p>

                                <div className="text-gray-800">

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

                  {/* QUANTITY */}

                  <div className="flex items-center gap-3 mt-4">

                    <span className="text-sm font-medium text-gray-700">
                      Quantity:
                    </span>

                    <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">

                      <button
                        type="button"
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
                        {item.quantity}
                      </span>

                      <button
                        type="button"
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

          ))}

        </div>

        {/* CHECKOUT */}

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
                value={customerName}
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
                value={customerEmail}
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
                value={customerPhone}
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
                  KSh {cartTotal}
                </span>

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={isSubmitting}
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
