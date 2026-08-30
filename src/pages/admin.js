
"use client";

import { useState } from "react";

import CategoryManager from "@/admin/categorymanager";
import ProductManager from "@/admin/productmanager";
import OrderManager from "@/admin/ordermanager";


export default function Admin() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");


  // -------------------------
  // Temporary Login
  // -------------------------

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMPORARY:
    // For now, clicking login is enough
    // to access the admin dashboard.

    setIsLoggedIn(true);
  };


  // -------------------------
  // Temporary Registration
  // -------------------------

  const handleRegister = (e) => {
    e.preventDefault();

    // TEMPORARY:
    // We are not sending anything to the backend yet.

    alert("Registration successful! You can now login.");

    setShowRegister(false);

    setUsername("");
    setRegisterEmail("");
    setRegisterPassword("");
  };


  // -------------------------
  // Logout
  // -------------------------

  const handleLogout = () => {
    setIsLoggedIn(false);
  };


  // -------------------------
  // Login / Register screen
  // -------------------------

  if (!isLoggedIn) {

    return (
      <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover bg-fixed flex items-center justify-center px-5">

        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8">

          {!showRegister ? (

            <>
              {/* Login */}

              <h2 className="text-3xl font-semibold text-center mb-2">
                Admin Login
              </h2>

              <p className="text-center text-gray-600 mb-8">
                Login to access the admin panel
              </p>


              <form onSubmit={handleLogin} className="space-y-5">

                <div>
                  <label className="block mb-2 font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                  />
                </div>


                <div>
                  <label className="block mb-2 font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                  />
                </div>


                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:opacity-80 transition"
                >
                  Login
                </button>

              </form>


              <p className="text-center mt-6 text-gray-600">

                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="font-semibold underline"
                >
                  Register
                </button>

              </p>

            </>

          ) : (

            <>
              {/* Register */}

              <h2 className="text-3xl font-semibold text-center mb-2">
                Admin Registration
              </h2>

              <p className="text-center text-gray-600 mb-8">
                Create your admin account
              </p>


              <form onSubmit={handleRegister} className="space-y-5">

                <div>
                  <label className="block mb-2 font-medium">
                    Username
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                  />
                </div>


                <div>
                  <label className="block mb-2 font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                  />
                </div>


                <div>
                  <label className="block mb-2 font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                  />
                </div>


                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:opacity-80 transition"
                >
                  Register
                </button>

              </form>


              <p className="text-center mt-6 text-gray-600">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="font-semibold underline"
                >
                  Login
                </button>

              </p>

            </>
          )}

        </div>

      </section>
    );
  }


  // -------------------------
  // Admin Dashboard
  // -------------------------

  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover bg-fixed">

      {/* Header */}

      <div className="flex justify-between items-center ml-7 mr-7 py-5">

        <div></div>

        <div>
          <h2 className="text-[30px] font-semibold">
            Admin Panel
          </h2>
        </div>

        <div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >

              <path
                d="M0 0h24v24H0z"
                fill="none"
              />

              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825-1.412-.587T3 5v14q0 .825.588 1.412T5 21zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l2.55-2.55L16 7l5 5z"
              />

            </svg>

            Log out

          </button>

        </div>

      </div>


      {/* Admin content */}

      <div className="space-y-10 px-7 pb-10">

        <CategoryManager />

        <ProductManager />

        <OrderManager />

      </div>

    </section>
  );
}

