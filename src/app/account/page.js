"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function loadAccount() {
      try {
        setLoading(true);
        setError("");

        // ============================================
        // GET LOGGED-IN USER
        // ============================================

        const userResponse = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        setUser(userData);

        // ============================================
        // GET CUSTOMER ORDERS
        // ============================================

        const ordersResponse = await fetch(`${API_URL}/my-orders`, {
          method: "GET",
          credentials: "include",
        });

        const ordersData = await ordersResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(
            ordersData.detail || "Unable to load your orders."
          );
        }

        setOrders(ordersData);
      } catch (error) {
        console.error("ACCOUNT ERROR:", error);
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [API_URL, router]);

  // ================================================
  // LOGOUT
  // ================================================

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }

  // ================================================
  // LOADING
  // ================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading your account...</p>
      </section>
    );
  }

  // ================================================
  // ERROR
  // ================================================

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>

          <Link
            href="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-12">

      {/* HEADER */}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-[5%] py-4 flex items-center justify-between">

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
            My Account
          </h1>

          <Link
            href="/productspage"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Continue Shopping
          </Link>

        </div>
      </div>

      {/* CONTENT */}

      <div className="max-w-5xl mx-auto px-6 mt-8">

        {/* USER INFORMATION */}

        <div className="bg-white rounded-xl shadow-sm border p-6">

          <h2 className="text-xl font-bold text-gray-800">
            Welcome, {user?.username}
          </h2>

          <p className="text-gray-500 mt-2">
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>

        </div>

        {/* ORDERS */}

        <div className="mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            My Orders
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <p className="text-gray-500">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/productspage"
                className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="font-bold text-gray-800">
                        Order #{order.id}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {order.status}
                    </span>

                  </div>

                  <div className="border-t mt-4 pt-4 flex justify-between">

                    <span className="text-gray-500">
                      Total
                    </span>

                    <span className="font-bold text-purple-600">
                      KSh {order.total_price}
                    </span>

                  </div>

                  <div className="mt-2 flex justify-between text-sm">

                    <span className="text-gray-500">
                      Payment
                    </span>

                    <span className="font-medium text-gray-700">
                      {order.payment_status}
                    </span>

                  </div>

                  {order.mpesa_receipt_number && (
                    <div className="mt-2 flex justify-between text-sm">

                      <span className="text-gray-500">
                        M-Pesa Receipt
                      </span>

                      <span className="font-medium text-gray-700">
                        {order.mpesa_receipt_number}
                      </span>

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </section>
  );
}