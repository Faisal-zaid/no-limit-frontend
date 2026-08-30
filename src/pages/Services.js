"use client";

import { useState } from "react";
import SearchWrapper from "@/components/SearchWrapper";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section className="min-h-screen">

      {/* ================= HEADER ================= */}
      
{/* ================= HEADER ================= */}
<div className="bg-white shadow-xl text-gray-700 pb-4">

  {/* =====================================================
      TOP HEADER
      ===================================================== */}
  <div className="
    px-[4%]
    pt-4
  ">

    <div className="
      flex
      items-center
      justify-between
      gap-4
    ">

      {/* LOGO */}
      <Link href="/">
        <Image
          src="/images/nolimit-logo.png"
          alt="No Limit Brands logo"
          width={77}
          height={75}
          className="w-[65px] h-auto sm:w-[77px]"
        />
      </Link>


      {/* DESKTOP SEARCH */}
      <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
        <SearchWrapper />
      </div>


      {/* RIGHT SIDE */}
      <div className="
        flex
        items-center
        gap-3
        sm:gap-5
      ">

        {/* ABOUT - DESKTOP ONLY */}
        <button className="
          hidden
          lg:flex
          items-center
          gap-1
          hover:text-purple-600
          transition
        ">

          <Image
            src="/images/info.png"
            alt="About"
            width={25}
            height={25}
          />

          <span>About</span>

        </button>


        {/* CART */}
        <Link
          href="/cartpage"
          className="
            flex
            items-center
            gap-1
            hover:text-purple-600
            transition
          "
        >

          <Image
            src="/images/Cart--Streamline-Platinum.png"
            alt="Cart"
            width={25}
            height={25}
          />

          <span className="hidden sm:inline">
            Cart
          </span>

        </Link>


        {/* SIGN IN */}
        <button className="
          flex
          items-center
          gap-1
          bg-purple-600
          hover:bg-purple-700
          text-white
          font-medium
          px-3
          sm:px-4
          py-2
          rounded-lg
          transition-colors
        ">

          <Image
            src="/images/login.png"
            alt="Sign in"
            width={22}
            height={22}
          />

          <span className="hidden sm:inline">
            Sign In
          </span>

        </button>

      </div>

    </div>


    {/* =====================================================
        MOBILE SEARCH
        ===================================================== */}
    <div className="
      lg:hidden
      mt-4
    ">

      <SearchWrapper />

    </div>


    {/* =====================================================
        NAVIGATION ROW
        ===================================================== */}
    <div className="
      flex
      items-center
      justify-between
      gap-4
      mt-5
    ">

      {/* ALL PRODUCTS */}
      <Link
        href="/productspage"
        className="
          flex
          items-center
          gap-2
          bg-gray-100
          hover:bg-gray-200
          rounded-[10px]
          px-3
          py-2
          whitespace-nowrap
          transition
        "
      >

        <Image
          src="/images/menu.png"
          alt="Menu"
          width={22}
          height={22}
        />

        <span className="text-sm sm:text-base">
          All Products
        </span>

      </Link>


      {/* NAVBAR */}
      <div className="
        flex-1
        overflow-x-auto
        scrollbar-hide
      ">

        <div className="
          min-w-max
          flex
          justify-center
        ">
          <Navbar />
        </div>

      </div>


      {/* SHOP ALL */}
      <Link
        href="/categoriespage"
        className="
          text-purple-600
          hover:text-purple-800
          font-medium
          whitespace-nowrap
          text-sm
          sm:text-base
        "
      >
        Shop All
      </Link>

    </div>

  </div>

</div>




      {/* ================= SERVICES CONTENT ================= */}
      {/* ================= SERVICES CONTENT ================= */}

<div className="
  mx-[3%]
  mt-6
  lg:mt-[3%]
">

  {/* =====================================================
      MOBILE VERSION
      ===================================================== */}

  <div className="lg:hidden">

    {/* SHOW CATEGORIES WHEN NOTHING IS SELECTED */}

    {!selectedCategory && (
      <div className="
        border
        rounded-[15px]
        w-full
        bg-white
      ">

        <h2 className="
          border-b
          px-6
          py-3
          font-semibold
          text-lg
        ">
          Categories
        </h2>

        <div className="py-4">

          <div className="
            flex
            justify-center
          ">
            <Categories
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="
            flex
            justify-center
            mb-3
          ">
            <Link
              href="/categoriespage"
              className="
                mt-3
                px-3
                py-1
                bg-purple-600
                text-white
                rounded-[6px]
                hover:bg-white
                hover:text-purple-600
                cursor-pointer
                border
                border-purple-600
              "
            >
              View all Categories
            </Link>
          </div>

        </div>

      </div>
    )}


    {/* SHOW DESCRIPTION ONLY AFTER CATEGORY IS SELECTED */}

    {selectedCategory && (
      <div className="
        w-full
        border
        border-gray-200
        rounded-xl
        shadow-sm
        overflow-hidden
        bg-white
      ">

        {/* BACK BUTTON */}

        <div className="p-4 border-b">

          <button
            onClick={() => setSelectedCategory(null)}
            className="
              text-purple-600
              hover:text-purple-800
              font-medium
            "
          >
            ← Back to Categories
          </button>

        </div>


        {/* CATEGORY DESCRIPTION */}

        <Categorydescription
          selectedCategory={selectedCategory}
        />

      </div>
    )}

  </div>



  {/* =====================================================
      DESKTOP VERSION
      ===================================================== */}

  <div className="
    hidden
    lg:flex
    border
    rounded-[20px]
    gap-6
  ">

    {/* ================= CATEGORIES ================= */}

    <div className="
      border
      rounded-[15px]
      lg:min-w-[280px]
      lg:ml-7
      lg:mr-7
      lg:mt-[3%]
    ">

      <h2 className="
        border-b
        px-15
        py-3
        font-semibold
        text-lg
      ">
        Categories
      </h2>


      <div>

        <div className="
          flex
          justify-center
          pl-[25%]
          py-4
        ">
          <Categories
            onSelectCategory={setSelectedCategory}
          />
        </div>


        <div className="
          flex
          justify-center
          mb-3
        ">

          <Link
            href="/categoriespage"
            className="
              mt-3
              px-3
              py-1
              bg-purple-600
              text-white
              rounded-[6px]
              hover:bg-white
              hover:text-purple-600
              cursor-pointer
              border
              border-purple-600
            "
          >
            View all Categories
          </Link>

        </div>

      </div>

    </div>



    {/* ================= CATEGORY DESCRIPTION ================= */}

    <div className="
      flex-1
      border
      border-gray-200
      rounded-xl
      shadow-sm
      overflow-hidden
      mr-7
      mt-[3%]
    ">

      <Categorydescription
        selectedCategory={selectedCategory}
      />

    </div>

  </div>

</div>

    </section>
  );
}