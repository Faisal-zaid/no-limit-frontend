"use client";

import { useEffect, useState } from "react";

export default function OrderManager() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {

    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);

    } catch (error) {

      console.error(
        "Failed to load orders:",
        error
      );

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow p-6">

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
          "
        >
          Refresh
        </button>

      </div>

      {orders.length === 0 ? (

        <p className="text-gray-500">
          No orders yet.
        </p>

      ) : (

        <div className="space-y-4">

          {orders.map((order) => (

            <div
              key={order.id}
              className="
                border
                rounded-xl
                p-5
              "
            >

              <div className="
                flex
                justify-between
                items-start
                gap-4
              ">

                <div>

                  <h3 className="text-lg font-bold">
                    Order #{order.id}
                  </h3>

                  <p className="text-gray-700">
                    {order.customer_name}
                  </p>

                  <p className="text-gray-500">
                    {order.customer_email}
                  </p>

                  <p className="text-gray-500">
                    {order.customer_phone}
                  </p>

                </div>

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

              <p className="text-sm text-gray-400 mt-4">
                Order ID: {order.id}
              </p>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}