
"use client";

import { useEffect, useState } from "react";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ==========================================
  // FETCH ORDERS WHEN COMPONENT LOADS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // FETCH ALL ORDERS
  // ==========================================

  async function fetchOrders() {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // OPEN ORDER DETAILS
  // ==========================================

  async function openOrder(order) {
    try {
      setSelectedOrder(order);
      setLoadingDetails(true);
      setOrderItems([]);

      // ==========================================
      // GET ORDER ITEMS
      // ==========================================

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orderitem/order/${order.id}`
      );

      if (!response.ok) {
        console.error(
          `Error ${response.status}: Failed to fetch order items`
        );

        setLoadingDetails(false);
        return;
      }

      const items = await response.json();

      if (!Array.isArray(items)) {
        console.error(
          "Expected an array of order items, received:",
          items
        );

        setLoadingDetails(false);
        return;
      }

      // ==========================================
      // GET CUSTOMIZATION VALUES FOR EACH ITEM
      // ==========================================

      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          try {
            const valueResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/orderitemfieldvalue/orderitem/${item.id}`
            );

            let customValues = [];

            if (valueResponse.ok) {
              const parsedValues = await valueResponse.json();

              if (Array.isArray(parsedValues)) {
                customValues = parsedValues;
              }
            }

            return {
              ...item,
              customValues,
            };
          } catch (error) {
            console.error(
              `Failed to fetch customization values for item ${item.id}:`,
              error
            );

            return {
              ...item,
              customValues: [],
            };
          }
        })
      );

      setOrderItems(itemsWithDetails);
    } catch (error) {
      console.error("Failed to load order details:", error);
    } finally {
      setLoadingDetails(false);
    }
  }

  // ==========================================
  // CLOSE ORDER DETAILS
  // ==========================================

  function closeOrder() {
    setSelectedOrder(null);
    setOrderItems([]);
  }

  // ==========================================
  // DOWNLOAD CUSTOMER IMAGE
  // ==========================================

  async function downloadCustomImage(imageUrl, fieldLabel) {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download = `${fieldLabel || "customer-customization"}.jpg`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);

      // Fallback:
      // If Cloudinary blocks the browser download because of CORS,
      // open the image in a new tab instead.
      window.open(imageUrl, "_blank");
    }
  }

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        Loading orders...
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      <section className="bg-white rounded-xl shadow p-6">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Orders
          </h2>

          <button
            onClick={fetchOrders}
            className="
              bg-purple-600
              hover:bg-purple-700
              text-white
              px-4
              py-2
              rounded-lg
              transition
            "
          >
            Refresh
          </button>

        </div>

        {/* ==========================================
            NO ORDERS
        ========================================== */}

        {orders.length === 0 ? (

          <p className="text-gray-500">
            No orders yet.
          </p>

        ) : (

          <div className="space-y-4">

            {orders.map((order) => (

              <div
                key={order.id}
                onClick={() => openOrder(order)}
                className="
                  border
                  rounded-xl
                  p-5
                  cursor-pointer
                  hover:bg-gray-50
                  hover:shadow-md
                  transition
                "
              >

                <div className="flex justify-between items-start gap-4">

                  {/* CUSTOMER */}

                  <div>

                    <h3 className="text-lg font-bold">
                      Order #{order.id}
                    </h3>

                    <p className="text-gray-700">
                      {order.customer_name}
                    </p>

                    <p className="text-gray-500">
                      {order.customer_phone}
                    </p>

                  </div>

                  {/* PRICE + STATUS */}

                  <div className="text-right">

                    <p className="font-bold">
                      KSh {order.total_price}
                    </p>

                    <span
                      className={`
                        inline-block
                        mt-2
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold

                        ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>

                <p className="text-purple-600 text-sm mt-4">
                  Click to view order details →
                </p>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (

        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            p-4
            z-50
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-xl
              w-full
              max-w-3xl
              max-h-[90vh]
              overflow-y-auto
              p-6
            "
          >

            {/* ==========================================
                MODAL HEADER
            ========================================== */}

            <div className="flex justify-between items-start mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Order #{selectedOrder.id}
                </h2>

                <p className="text-gray-600">
                  {selectedOrder.customer_name}
                </p>

              </div>

              <button
                onClick={closeOrder}
                className="
                  text-gray-500
                  hover:text-red-500
                  text-2xl
                  transition
                "
              >
                ×
              </button>

            </div>

            {/* ==========================================
                CUSTOMER DETAILS
            ========================================== */}

            <div
              className="
                bg-gray-50
                rounded-xl
                p-4
                mb-6
              "
            >

              <h3 className="font-bold mb-3">
                Customer Details
              </h3>

              <p>
                <span className="font-semibold">
                  Name:
                </span>{" "}
                {selectedOrder.customer_name}
              </p>

              <p>
                <span className="font-semibold">
                  Email:
                </span>{" "}
                {selectedOrder.customer_email}
              </p>

              <p>
                <span className="font-semibold">
                  Phone:
                </span>{" "}
                {selectedOrder.customer_phone}
              </p>

            </div>

            {/* ==========================================
                ORDER ITEMS
            ========================================== */}

            <h3 className="text-xl font-bold mb-4">
              Products Ordered
            </h3>

            {loadingDetails ? (

              <p>
                Loading order details...
              </p>

            ) : orderItems.length === 0 ? (

              <p className="text-gray-500">
                No products found for this order.
              </p>

            ) : (

              <div className="space-y-5">

                {orderItems.map((item) => (

                  <div
                    key={item.id}
                    className="
                      border
                      rounded-xl
                      p-5
                    "
                  >

                    {/* ==========================================
                        PRODUCT INFORMATION
                    ========================================== */}

                    <div
                      className="
                        flex
                        justify-between
                        gap-4
                      "
                    >

                      <div className="flex gap-4">

                        {/* PRODUCT IMAGE */}

                        {item.product_image && (

                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="
                              w-20
                              h-20
                              object-cover
                              rounded-lg
                              border
                            "
                          />

                        )}

                        {/* PRODUCT DETAILS */}

                        <div>

                          <h4 className="font-bold text-lg">
                            {item.product_name}
                          </h4>

                          <p className="text-gray-600">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-gray-600">
                            Price: KSh {item.base_price}
                          </p>

                        </div>

                      </div>

                      {/* ORDER ITEM NUMBER */}

                      <span
                        className="
                          bg-purple-100
                          text-purple-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          h-fit
                          whitespace-nowrap
                        "
                      >
                        Order Item #{item.id}
                      </span>

                    </div>

                    {/* ==========================================
                        CUSTOMER CUSTOMIZATION
                    ========================================== */}

                    {item.customValues &&
                      item.customValues.length > 0 && (

                        <div
                          className="
                            mt-5
                            bg-gray-50
                            rounded-lg
                            p-4
                          "
                        >

                          <h5 className="font-bold mb-4">
                            Customer Customization
                          </h5>

                          <div className="space-y-4">

                            {item.customValues.map((value) => {

                              const isImage =
                                value.field_type === "image" ||
                                (
                                  typeof value.value === "string" &&
                                  (
                                    value.value.includes(
                                      "cloudinary.com"
                                    ) ||
                                    value.value.includes(
                                      "res.cloudinary.com"
                                    )
                                  )
                                );

                              return (

                                <div
                                  key={value.id}
                                  className="
                                    border-b
                                    pb-4
                                    last:border-b-0
                                  "
                                >

                                  {/* FIELD NAME */}

                                  <p className="text-sm text-gray-500 mb-1">
                                    {value.field_label}
                                  </p>

                                  {/* ==================================
                                      IMAGE CUSTOMIZATION
                                  ================================== */}

                                  {isImage ? (

                                    <div className="mt-3">

                                      <p className="font-semibold mb-3">
                                        Customer Image
                                      </p>

                                      {/* IMAGE */}

                                      <div className="flex flex-col sm:flex-row gap-4 items-start">

                                        <img
                                          src={value.value}
                                          alt="Customer customization"
                                          className="
                                            w-48
                                            h-48
                                            object-cover
                                            rounded-lg
                                            border
                                            shadow-sm
                                          "
                                        />

                                        <div className="flex flex-col gap-2">

                                          {/* DOWNLOAD */}

                                          <button
                                            onClick={() =>
                                              downloadCustomImage(
                                                value.value,
                                                value.field_label
                                              )
                                            }
                                            className="
                                              bg-purple-600
                                              hover:bg-purple-700
                                              text-white
                                              px-4
                                              py-2
                                              rounded-lg
                                              font-semibold
                                              transition
                                            "
                                          >
                                            Download Image
                                          </button>

                                          {/* OPEN */}

                                          <a
                                            href={value.value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                              text-purple-600
                                              hover:text-purple-800
                                              text-sm
                                              font-medium
                                            "
                                          >
                                            Open Full Image →
                                          </a>

                                        </div>

                                      </div>

                                    </div>

                                  ) : (

                                    /* ==================================
                                       NORMAL CUSTOMIZATION VALUE
                                    ================================== */

                                    <p className="font-semibold">
                                      {value.value}
                                    </p>

                                  )}

                                </div>

                              );

                            })}

                          </div>

                        </div>

                      )}

                  </div>

                ))}

              </div>

            )}

            {/* ==========================================
                ORDER TOTAL
            ========================================== */}

            <div
              className="
                border-t
                mt-6
                pt-5
                flex
                justify-between
                text-lg
                font-bold
              "
            >

              <span>
                Total
              </span>

              <span className="text-purple-600">
                KSh {selectedOrder.total_price}
              </span>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

