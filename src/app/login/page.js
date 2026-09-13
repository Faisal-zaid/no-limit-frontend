
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();

      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      // Confirm that the cookie-based login actually works
      const userResponse = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        credentials: "include",
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setError("Login succeeded, but your session could not be verified.");
        return;
      }

      console.log("Logged in user:", userData);

      // Customer goes back to the shopping area
      router.push("/Services");

    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        min-h-screen
        bg-[url('/images/nolimitbackground.png')]
        bg-no-repeat
        bg-cover
        bg-center
        bg-fixed
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-xl
          p-6
          sm:p-8
        "
      >
        {/* LOGO */}

        <div className="flex justify-center mb-5">
          <Image
            src="/images/nolimit-logo.png"
            alt="No Limit Brands"
            width={77}
            height={75}
          />
        </div>

        {/* HEADING */}

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to view and manage your orders.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* USERNAME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-3
                py-2.5
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
              placeholder="Enter your username"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-3
                  py-2.5
                  pr-12
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-purple-600
                  transition-colors
                "
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                bg-red-50
                border
                border-red-200
                text-red-600
                rounded-lg
                px-3
                py-2
                text-sm
              "
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              disabled:bg-purple-300
              text-white
              font-medium
              py-2.5
              rounded-lg
              transition
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* SIGNUP LINK */}

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

