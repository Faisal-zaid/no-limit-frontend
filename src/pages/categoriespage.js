"use client";

import { useState } from "react";
import Categorydisplay from "@/components/categorydisplay";
import Link from "next/link";
import SearchWrapper from "@/components/SearchWrapper";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function CategoriesPage() {
const [selectedCategory, setSelectedCategory] = useState(null);

const phoneNumber = "254780887324";

const defaultMessage = encodeURIComponent(
"Hello No Limit Brands! I would like to consult on your branding services."
);

const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

return ( <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">


  {/* ================= HEADER ================= */}
  <header className="bg-white shadow-xl text-gray-700 pb-4">

    {/* TOP HEADER */}
    <div className="px-4 sm:px-6 lg:px-[3%] pt-3">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* LOGO + SEARCH */}
        <div className="flex items-center gap-4 sm:gap-8">

          <Image
            src="/images/nolimit-logo.png"
            alt="No Limit Brands"
            width={65}
            height={63}
            className="w-[60px] sm:w-[65px] h-auto"
          />

          <div className="flex-1 max-w-md">
            <SearchWrapper />
          </div>

        </div>

        {/* DESKTOP INFO */}
        <div className="hidden sm:flex items-center justify-between lg:justify-end gap-5 lg:gap-8 text-sm">

          <div className="flex items-center gap-2">
            <Image
              src="/images/info.png"
              alt="About"
              width={22}
              height={22}
            />
            <span>About</span>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/images/Cart--Streamline-Platinum.png"
              alt="Cart"
              width={22}
              height={22}
            />
            <span>Cart</span>
          </div>

          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
            <Image
              src="/images/login.png"
              alt="Sign in"
              width={22}
              height={22}
            />
            <span>Sign In</span>
          </button>

        </div>

      </div>

      {/* MOBILE INFO */}
      <div className="flex sm:hidden justify-between items-center mt-4 text-xs">

        <div className="flex items-center gap-1">
          <Image
            src="/images/info.png"
            alt="About"
            width={20}
            height={20}
          />
          <span>About</span>
        </div>

        <Link
              href="/cartpage"
              className="
                flex
                items-center
                hover:text-purple-600
                cursor-pointer
              "
            >
              <ul className="flex items-center gap-1">
                <li>
                  <Image
                    src="/images/Cart--Streamline-Platinum.png"
                    alt="Cart"
                    width={25}
                    height={25}
                  />
                </li>

                <li>Cart</li>
              </ul>
            </Link>

        <button className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg">
          <Image
            src="/images/login.png"
            alt="Sign in"
            width={20}
            height={20}
          />
          <span>Sign In</span>
        </button>

      </div>

    </div>


    {/* NAVIGATION */}
    <div className="px-4 sm:px-6 lg:px-[3%] mt-5">

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* ALL PRODUCTS */}
        <div
            className="
              px-3
              py-2
              bg-gray-100
              rounded-[10px]
              w-full
              lg:w-auto
            "
          >
            <ul className="
              flex
              items-center
              justify-center
              lg:justify-start
              gap-3
            ">
              <li>
                <Image
                  src="/images/menu.png"
                  alt="Menu"
                  width={25}
                  height={25}
                />
              </li>

              <li>
                <Link href="/productspage">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

        {/* NAVBAR */}
        <div className="w-full sm:flex-1 overflow-x-auto">

          <div className="min-w-max flex justify-center">
            <Navbar />
          </div>

        </div>


        {/* SHOP ALL */}
        <div className="hidden sm:block text-purple-600 whitespace-nowrap">
          Shop All
        </div>

      </div>

    </div>

  </header>


  {/* ================= INTRO ================= */}

  <div className="px-4 sm:px-6 pt-8 sm:pt-10 text-center">

    <button className="inline-flex items-center gap-2 border border-purple-700 rounded-full px-4 py-2 bg-purple-600 text-white">

      <Image
        src="/images/star.png"
        alt="Categories"
        width={20}
        height={20}
      />

      <span>Categories</span>

    </button>


    <h2 className="font-bold text-xl sm:text-2xl mt-4">
      Professional Branding Services
    </h2>


    <p className="mt-3 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">

      <span className="font-bold">No Limit Brands</span> delivers
      high-impact branding solutions across{" "}

      <span className="font-bold">
        Nairobi, Kenya, and East Africa
      </span>

      <br className="hidden sm:block" />

      specializing in{" "}

      <span className="font-bold">
        complete brand identity
      </span>{" "}

      development, corporate branding, vehicle wraps and matatu
      graphics, professional signage, promotional printing, packaging
      design, and corporate stationery for ambitious startups, SMEs,
      and enterprise corporations.

    </p>

  </div>


  {/* ================= CATEGORIES ================= */}

  <div className="px-4 sm:px-6 lg:px-8 py-8">

    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white">

      <Categorydisplay
        onSelectCategory={setSelectedCategory}
      />

    </div>


    {/* ================= CONTACT ================= */}

    <div className="border border-gray-200 rounded-xl p-5 sm:p-6 bg-white mt-8 flex flex-col items-center text-center">

      <h2 className="font-bold text-lg sm:text-xl">
        Ready to Transform Your Brand?
      </h2>

      <p className="mt-1 text-sm sm:text-base text-gray-600">
        Contact us for a free consultation
      </p>


      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition w-full sm:w-auto"
      >

        <span className="text-lg">
          WhatsApp
        </span>

        Chat with Us

      </Link>

    </div>

  </div>

</section>


);
}
