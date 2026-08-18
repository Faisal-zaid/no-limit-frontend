"use client";

import { useEffect, useState } from "react";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

      // Get all products belonging to this order
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orderitem/order/${order.id}`
      );

      // Handle failed non-200 HTTP responses (e.g. 404 Not Found)
      if (!response.ok) {
        console.error(`Error ${response.status}: Failed to fetch order items`);
        return;
      }

      const items = await response.json();

      // Ensure response is actually an array before mapping over it
      if (!Array.isArray(items)) {
        console.error("Expected an array of order items, received:", items);
        return;
      }

      // Get customization values for every item
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
          } catch (err) {
            console.error(`Failed to fetch values for item ${item.id}`, err);
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
  // CLOSE MODAL
  // ==========================================

  function closeOrder() {
    setSelectedOrder(null);
    setOrderItems([]);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        Loading orders...
      </div>
    );
  }

  return (
    <>
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Orders</h2>
          <button
            onClick={fetchOrders}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => openOrder(order)}
                className="border rounded-xl p-5 cursor-pointer hover:bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-700">{order.customer_name}</p>
                    <p className="text-gray-500">{order.customer_phone}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">KSh {order.total_price}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
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

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Order #{selectedOrder.id}
                </h2>
                <p className="text-gray-600">{selectedOrder.customer_name}</p>
              </div>

              <button
                onClick={closeOrder}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>
            </div>

            {/* CUSTOMER DETAILS */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold mb-3">Customer Details</h3>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {selectedOrder.customer_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedOrder.customer_email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedOrder.customer_phone}
              </p>
            </div>

            {/* ORDER ITEMS */}
            <h3 className="text-xl font-bold mb-4">Products Ordered</h3>

            {loadingDetails ? (
              <p>Loading order details...</p>
            ) : orderItems.length === 0 ? (
              <p className="text-gray-500">
                No products found for this order.
              </p>
            ) : (
              <div className="space-y-5">
                {orderItems.map((item) => (
                  <div key={item.id} className="border rounded-xl p-5">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-lg">
                          Product ID: {item.product_id}
                        </h4>
                        <p className="text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm h-fit">
                        Order Item #{item.id}
                      </span>
                    </div>

                    {/* CUSTOMIZATION */}
                    {item.customValues && item.customValues.length > 0 && (
                      <div className="mt-5 bg-gray-50 rounded-lg p-4">
                        <h5 className="font-bold mb-3">
                          Customer Customization
                        </h5>

                        <div className="space-y-3">
                          {item.customValues.map((value) => (
                            <div
                              key={value.id}
                              className="border-b pb-3 last:border-b-0"
                            >
                              <p className="text-sm text-gray-500">
                                Product Field ID: {value.product_field_id}
                              </p>

                              {typeof value.value === "string" &&
                              value.value.includes("cloudinary") ? (
                                <div className="mt-2">
                                  <p className="font-semibold mb-2">
                                    Customer Image
                                  </p>
                                  <img
                                    src={value.value}
                                    alt="Customer customization"
                                    className="w-40 h-40 object-cover rounded-lg border"
                                  />
                                  <a
                                    href={value.value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 text-sm mt-2 inline-block"
                                  >
                                    Open full image
                                  </a>
                                </div>
                              ) : (
                                <p className="font-semibold">{value.value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ORDER TOTAL */}
            <div className="border-t mt-6 pt-5 flex justify-between text-lg font-bold">
              <span>Total</span>
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