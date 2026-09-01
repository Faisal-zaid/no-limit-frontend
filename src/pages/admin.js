
"use client";

import { useEffect, useState } from "react";

import CategoryManager from "@/admin/categorymanager";
import ProductManager from "@/admin/productmanager";
import OrderManager from "@/admin/ordermanager";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Admin() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // --------------------------------
  // Admin management
  // --------------------------------

  const [promoteUsername, setPromoteUsername] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [promoteMessage, setPromoteMessage] = useState("");
  const [promoteError, setPromoteError] = useState("");


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // --------------------------------
  // Check authentication on page load
  // --------------------------------

  useEffect(() => {

    const checkAuthentication = async () => {

      try {

        const response = await fetch(
          `${API_URL}/users/me`,
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (response.ok) {

          const user = await response.json();

          // Only allow admins into the admin panel
          if (user.role === "admin") {

            setIsLoggedIn(true);

          } else {

            setIsLoggedIn(false);
            setError(
              "You do not have permission to access the admin panel."
            );

          }

        } else {

          setIsLoggedIn(false);

        }

      } catch (error) {

        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);

      } finally {

        setCheckingAuth(false);

      }

    };

    checkAuthentication();

  }, []);


  // --------------------------------
  // Login
  // --------------------------------

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/token`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },

          credentials: "include",

          body: new URLSearchParams({
            username: username,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.detail || "Login failed. Please check your credentials."
        );

        return;
      }


      // Verify the newly authenticated user

      const userResponse = await fetch(
        `${API_URL}/users/me`,
        {
          method: "GET",
          credentials: "include"
        }
      );


      if (!userResponse.ok) {

        setError(
          "Login succeeded, but the user could not be verified."
        );

        return;
      }


      const user = await userResponse.json();


      // Only admins can access this panel

      if (user.role !== "admin") {

        // Logout immediately if a non-admin logs in

        await fetch(
          `${API_URL}/logout`,
          {
            method: "POST",
            credentials: "include"
          }
        );

        setError(
          "You do not have permission to access the admin panel."
        );

        return;
      }


      setIsLoggedIn(true);

      setUsername("");
      setPassword("");


    } catch (error) {

      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------
  // Registration
  // --------------------------------

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username: registerUsername,
            email: registerEmail,
            password: registerPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.detail || "Registration failed."
        );

        return;
      }


      // Registration successful

      setRegisterUsername("");
      setRegisterEmail("");
      setRegisterPassword("");

      setShowRegister(false);

      setError("");

    } catch (error) {

      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------
  // Promote customer to admin
  // --------------------------------

  const handlePromoteUser = async (e) => {

    e.preventDefault();

    setPromoteMessage("");
    setPromoteError("");

    if (!promoteUsername.trim()) {

      setPromoteError("Please enter a username.");

      return;
    }

    setPromoting(true);

    try {

      const response = await fetch(
        `${API_URL}/admin/users/${encodeURIComponent(
          promoteUsername.trim()
        )}/promote`,
        {
          method: "POST",
          credentials: "include"
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setPromoteError(
          data.detail || "Failed to promote user."
        );

        return;
      }


      // Promotion successful

      setPromoteMessage(
        `${data.username} is now an admin.`
      );

      setPromoteUsername("");


    } catch (error) {

      console.error("Promote user error:", error);

      setPromoteError(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setPromoting(false);

    }

  };


  // --------------------------------
  // Logout
  // --------------------------------

  const handleLogout = async () => {

    try {

      await fetch(
        `${API_URL}/logout`,
        {
          method: "POST",
          credentials: "include"
        }
      );

    } catch (error) {

      console.error("Logout error:", error);

    } finally {

      setIsLoggedIn(false);

    }

  };


  // --------------------------------
  // Checking authentication
  // --------------------------------

  if (checkingAuth) {

    return (

      <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover bg-fixed flex items-center justify-center">

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8">

          <p className="text-lg">
            Checking authentication...
          </p>

        </div>

      </section>

    );

  }


  // --------------------------------
  // Login / Registration screen
  // --------------------------------

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


              {error && (

                <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                  {error}
                </div>

              )}


              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                <div>

                  <label className="block mb-2 font-medium">
                    Username
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
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
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:opacity-80 transition disabled:opacity-50"
                >

                  {loading ? "Logging in..." : "Login"}

                </button>

              </form>


              <p className="text-center mt-6 text-gray-600">

                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(true);
                    setError("");
                  }}
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
                Create Account
              </h2>

              <p className="text-center text-gray-600 mb-8">
                Create a customer account
              </p>


              {error && (

                <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                  {error}
                </div>

              )}


              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >

                <div>

                  <label className="block mb-2 font-medium">
                    Username
                  </label>

                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
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
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:opacity-80 transition disabled:opacity-50"
                >

                  {loading ? "Registering..." : "Register"}

                </button>

              </form>


              <p className="text-center mt-6 text-gray-600">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError("");
                  }}
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


  // --------------------------------
  // Admin Dashboard
  // --------------------------------

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
                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm9-4l-1.375-1.45l2.55-2.55H9v-2h6.175l-2.55-2.55L14 7l5 5z"
              />

            </svg>

            Log out

          </button>

        </div>

      </div>


      {/* Admin Management */}

      <div className="px-7 mb-10">

        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6">

          <h2 className="text-2xl font-semibold mb-2">
            Admin Management
          </h2>

          <p className="text-gray-600 mb-6">
            Promote an existing customer to an admin.
          </p>


          <form
            onSubmit={handlePromoteUser}
            className="flex flex-col md:flex-row gap-4"
          >

            <input
              type="text"
              value={promoteUsername}
              onChange={(e) => setPromoteUsername(e.target.value)}
              placeholder="Enter customer's username"
              className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2"
            />


            <button
              type="submit"
              disabled={promoting}
              className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition disabled:opacity-50"
            >

              {promoting ? "Promoting..." : "Make Admin"}

            </button>

          </form>


          {promoteMessage && (

            <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
              {promoteMessage}
            </div>

          )}


          {promoteError && (

            <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {promoteError}
            </div>

          )}

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

