
"use client";

import { useEffect, useState } from "react";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  const [activeTab, setActiveTab] = useState("active");

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // FETCH ORDERS WHEN COMPONENT LOADS
  // =====================================================

  useEffect(() => {
    fetchOrders();
    fetchOrderHistory();
  }, []);

  // =====================================================
  // FETCH ACTIVE ORDERS
  // Pending + Processing
  // =====================================================

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

  // =====================================================
  // FETCH ORDER HISTORY
  // Completed + Cancelled
  // =====================================================

  async function fetchOrderHistory() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/history`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order history");
      }

      const data = await response.json();

      setHistoryOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load order history:", error);
      setHistoryOrders([]);
    }
  }

  // =====================================================
  // REFRESH BOTH ACTIVE ORDERS AND HISTORY
  // =====================================================

  async function refreshOrders() {
    await Promise.all([
      fetchOrders(),
      fetchOrderHistory(),
    ]);
  }

  // =====================================================
  // OPEN ORDER DETAILS
  // =====================================================

  async function openOrder(order) {
    try {
      setSelectedOrder(order);
      setSelectedStatus(order.status);
      setLoadingDetails(true);
      setOrderItems([]);

      // =====================================================
      // GET ORDER ITEMS
      // =====================================================

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

      // =====================================================
      // GET CUSTOMIZATION VALUES FOR EACH ITEM
      // =====================================================

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

  // =====================================================
  // CLOSE ORDER DETAILS
  // =====================================================

  function closeOrder() {
    setSelectedOrder(null);
    setOrderItems([]);
    setSelectedStatus("");
  }

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  async function updateOrderStatus() {
    if (!selectedOrder) {
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${selectedOrder.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_name: selectedOrder.customer_name,
            customer_email: selectedOrder.customer_email,
            customer_phone: selectedOrder.customer_phone,
            status: selectedStatus,
            total_price: selectedOrder.total_price,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        console.error(
          "Failed to update order:",
          errorData
        );

        alert("Failed to update order status.");

        return;
      }

      // Update the selected order immediately
      const updatedOrder = {
        ...selectedOrder,
        status: selectedStatus,
      };

      setSelectedOrder(updatedOrder);

      // Refresh active orders and history
      await refreshOrders();

      alert(
        `Order #${selectedOrder.id} is now ${selectedStatus}.`
      );

      // If completed or cancelled, close modal
      // because the order has moved into history.
      if (
        selectedStatus === "Completed" ||
        selectedStatus === "Cancelled"
      ) {
        closeOrder();
      }
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert(
        "Something went wrong while updating the order."
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  // =====================================================
  // DOWNLOAD CUSTOMER IMAGE
  // =====================================================

  async function downloadCustomImage(
    imageUrl,
    fieldLabel
  ) {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download =
        `${fieldLabel || "customer-customization"}.jpg`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        "Failed to download image:",
        error
      );

      // Fallback if Cloudinary blocks browser download
      window.open(imageUrl, "_blank");
    }
  }

  // =====================================================
  // STATUS COLOR
  // =====================================================

  function getStatusClass(status) {
    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Processing") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  // =====================================================
  // CURRENT ORDERS TO DISPLAY
  // =====================================================

  const displayedOrders =
    activeTab === "active"
      ? orders
      : historyOrders;

  // =====================================================
  // SEARCH ORDERS
  //
  // Searches by:
  // 1. Customer name
  // 2. Customer phone number
  // =====================================================

  const filteredOrders = displayedOrders.filter(
    (order) => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      // If search box is empty,
      // show all orders.
      if (!search) {
        return true;
      }

      const customerName =
        String(order.customer_name || "")
          .toLowerCase();

      const customerPhone =
        String(order.customer_phone || "")
          .toLowerCase();

      return (
        customerName.includes(search) ||
        customerPhone.includes(search)
      );
    }
  );

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        Loading orders...
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <section className="bg-white rounded-xl shadow p-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              Orders
            </h2>

            <p className="text-gray-500 mt-1">
              Manage customer orders and track their progress.
            </p>
          </div>

          <button
            onClick={refreshOrders}
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

        {/* =================================================
            TABS
        ================================================= */}

        <div className="flex gap-2 border-b mb-6">

          <button
            onClick={() => {
              setActiveTab("active");
              setSearchTerm("");
            }}
            className={`
              px-5
              py-3
              font-semibold
              border-b-2
              transition

              ${
                activeTab === "active"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Active Orders ({orders.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("history");
              setSearchTerm("");
            }}
            className={`
              px-5
              py-3
              font-semibold
              border-b-2
              transition

              ${
                activeTab === "history"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Order History ({historyOrders.length})
          </button>

        </div>

        {/* =================================================
    SEARCH
================================================= */}

<div className="mb-6">

  <div className="flex flex-col sm:flex-row gap-3">

    {/* SEARCH INPUT */}

    <div className="relative flex-1">

      <div
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      >
        🔍
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        placeholder="Enter customer name or phone number..."
        className="
          w-full
          border
          border-gray-300
          rounded-lg
          pl-11
          pr-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500
          focus:border-purple-500
        "
      />

    </div>

    {/* SEARCH BUTTON */}

    <button
      onClick={() => setSearchTerm(searchTerm.trim())}
      className="
        bg-purple-600
        hover:bg-purple-700
        text-white
        px-6
        py-3
        rounded-lg
        font-semibold
        transition
      "
    >
      Search
    </button>

    {/* CLEAR BUTTON */}

    {searchTerm && (
      <button
        onClick={() => setSearchTerm("")}
        className="
          bg-gray-200
          hover:bg-gray-300
          text-gray-700
          px-5
          py-3
          rounded-lg
          font-semibold
          transition
        "
      >
        Clear
      </button>
    )}

  </div>

  {/* SEARCH RESULT COUNT */}

  {searchTerm.trim() && (
    <p className="text-sm text-gray-500 mt-2">
      Showing {filteredOrders.length}{" "}
      {filteredOrders.length === 1
        ? "order"
        : "orders"}{" "}
      matching "{searchTerm}"
    </p>
  )}

</div>
          

        {/* =================================================
            NO ORDERS / NO SEARCH RESULTS
        ================================================= */}

        {filteredOrders.length === 0 ? (

          <div className="text-center py-12">

            <p className="text-gray-500 text-lg">

              {searchTerm.trim()
                ? "No orders found matching your search."
                : activeTab === "active"
                ? "No active orders."
                : "No order history yet."}

            </p>

            {searchTerm.trim() && (
              <button
                onClick={() => setSearchTerm("")}
                className="
                  mt-3
                  text-purple-600
                  hover:text-purple-800
                  font-semibold
                "
              >
                Clear search
              </button>
            )}

          </div>

        ) : (

          <div className="space-y-4">

            {filteredOrders.map((order) => (

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
                        ${getStatusClass(order.status)}
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

            {/* =================================================
                MODAL HEADER
            ================================================= */}

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

            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <div
              className="
                bg-purple-50
                border
                border-purple-100
                rounded-xl
                p-4
                mb-6
              "
            >

              <h3 className="font-bold mb-3">
                Order Status
              </h3>

              <div className="flex flex-col sm:flex-row gap-3">

                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target.value
                    )
                  }
                  className="
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-2
                    bg-white
                    flex-1
                    focus:outline-none
                    focus:ring-2
                    focus:ring-purple-500
                  "
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

                <button
                  onClick={updateOrderStatus}
                  disabled={
                    updatingStatus ||
                    selectedStatus ===
                      selectedOrder.status
                  }
                  className="
                    bg-purple-600
                    hover:bg-purple-700
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    font-semibold
                    transition
                  "
                >

                  {updatingStatus
                    ? "Updating..."
                    : "Update Status"}

                </button>

              </div>

              <p className="text-sm text-gray-500 mt-3">

                Current status:{" "}

                <span className="font-semibold">
                  {selectedOrder.status}
                </span>

              </p>

            </div>

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

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

            {/* =================================================
                ORDER ITEMS
            ================================================= */}

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

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

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

                    {/* =================================================
                        CUSTOMER CUSTOMIZATION
                    ================================================= */}

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

                            {item.customValues.map(
                              (value) => {

                                const isImage =
                                  value.field_type ===
                                    "image" ||
                                  (
                                    typeof value.value ===
                                      "string" &&
                                    (
                                      value.value.includes(
                                        "cloudinary.com"
                                      ) ||
                                      value.value.includes(
                                        "res.cloudinary.app"
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

                                    {/* IMAGE CUSTOMIZATION */}

                                    {isImage ? (

                                      <div className="mt-3">

                                        <p className="font-semibold mb-3">
                                          Customer Image
                                        </p>

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

                                      /* NORMAL CUSTOMIZATION VALUE */

                                      <p className="font-semibold">
                                        {value.value}
                                      </p>

                                    )}

                                  </div>

                                );
                              }
                            )}

                          </div>

                        </div>

                      )}

                  </div>

                ))}

              </div>

            )}

            {/* =================================================
                ORDER TOTAL
            ================================================= */}

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

