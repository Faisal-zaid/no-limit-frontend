"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function handleSignup(e) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Registration failed");
        return;
      }

      // Registration succeeded.
      // Send the customer to the login page.
      router.push("/login");

    } catch (error) {
      console.error("Signup error:", error);
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
            Create Your Account
          </h1>

          <p className="text-gray-500 mt-2">
            Create an account to manage your orders.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">

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

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your email"
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
                "
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                placeholder="Confirm your password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-purple-600
                "
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* PASSWORD MATCH MESSAGE */}

          {confirmPassword && (
            <p
              className={
                password === confirmPassword
                  ? "text-sm text-green-600"
                  : "text-sm text-red-600"
              }
            >
              {password === confirmPassword
                ? "✓ Passwords match"
                : "✕ Passwords do not match"}
            </p>
          )}

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* SUBMIT */}

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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}