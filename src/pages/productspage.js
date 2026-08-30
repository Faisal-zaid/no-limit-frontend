
"use client";

import { useState, useEffect } from "react";
import Productdisplay from "@/components/Productdisplay";
import Link from "next/link";
import SearchWrapper from "@/components/SearchWrapper";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category`
        );

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <section
      className="
        min-h-screen
        bg-[url('/images/nolimitbackground.png')]
        bg-no-repeat
        bg-cover
        bg-fixed
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="
        bg-white
        border-b
        border-gray-700
        shadow-xl
        text-gray-700
        pb-4
      ">

        {/* =====================================================
            TOP HEADER
        ====================================================== */}

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

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              className="flex-shrink-0"
            >
              <Image
                src="/images/nolimit-logo.png"
                alt="No Limit Brands logo"
                width={77}
                height={75}
                className="
                  w-[65px]
                  h-auto
                  sm:w-[77px]
                "
              />
            </Link>


            {/* =================================================
                DESKTOP SEARCH
            ================================================= */}

            <div className="
              hidden
              lg:flex
              flex-1
              max-w-2xl
              mx-8
            ">
              <SearchWrapper />
            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="
              flex
              items-center
              gap-3
              sm:gap-5
              flex-shrink-0
            ">

              {/* ================= ABOUT ================= */}

              <button
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-1
                  hover:text-purple-600
                  transition
                "
              >

                <Image
                  src="/images/info.png"
                  alt="About"
                  width={25}
                  height={25}
                />

                <span>
                  About
                </span>

              </button>


              {/* ================= CART ================= */}

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

                {/* Hide text on very small screens */}
                <span className="hidden sm:inline">
                  Cart
                </span>

              </Link>


              {/* ================= SIGN IN ================= */}

              <button
                className="
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
                "
              >

                <Image
                  src="/images/login.png"
                  alt="Sign in"
                  width={22}
                  height={22}
                />

                {/* Hide text on very small screens */}
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
            w-full
          ">

            <SearchWrapper />

          </div>


          {/* =====================================================
              SECOND NAVIGATION
          ===================================================== */}

          <div className="
            flex
            items-center
            gap-3
            mt-5
            overflow-hidden
          ">

            {/* =================================================
                ALL PRODUCTS
            ================================================= */}

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
                flex-shrink-0
                transition
              "
            >

              <Image
                src="/images/menu.png"
                alt="Menu"
                width={22}
                height={22}
              />

              <span className="
                text-sm
                sm:text-base
              ">
                All Products
              </span>

            </Link>


            {/* =================================================
                CATEGORY NAVBAR
            ================================================= */}

            <div className="
              flex-1
              overflow-x-auto
              scrollbar-hide
              min-w-0
            ">

              <div className="
                min-w-max
                flex
                justify-center
              ">
                <Navbar />
              </div>

            </div>


            {/* =================================================
                SHOP ALL
            ================================================= */}

            <Link
              href="/categoriespage"
              className="
                text-purple-600
                hover:text-purple-800
                font-medium
                whitespace-nowrap
                text-sm
                sm:text-base
                flex-shrink-0
              "
            >
              Shop All
            </Link>

          </div>

        </div>

      </div>


      {/* =====================================================
          PAGE INTRO
      ====================================================== */}

      <div className="
        pt-8
        sm:pt-10
        px-4
        text-center
      ">

        {/* PRODUCTS BADGE */}

        <button
          className="
            border
            py-2
            px-4
            rounded-[30px]
            border-purple-700
            bg-purple-600
            text-white
          "
        >

          <span className="
            flex
            items-center
            gap-2
          ">

            <Image
              src="/images/star.png"
              alt="Products"
              width={25}
              height={25}
            />

            <span>
              Products
            </span>

          </span>

        </button>


        {/* TITLE */}

        <h2 className="
          font-bold
          text-[22px]
          sm:text-[25px]
          mt-3
        ">
          Shop by Category
        </h2>


        {/* DESCRIPTION */}

        <p className="
          text-sm
          sm:text-base
          mt-2
          max-w-2xl
          mx-auto
          px-2
        ">
          Check our Products by Category to find what you would like
        </p>

      </div>


      {/* =====================================================
          SHOP CONTENT
      ====================================================== */}

      <div className="
        w-full
        gap-6
        flex
        flex-col
        lg:flex-row
        p-4
        lg:p-6
        shadow-sm
      ">


        {/* =====================================================
            LEFT SIDEBAR
        ====================================================== */}

        <div
          className={`
            border
            w-full
            lg:w-[20%]
            border-gray-200
            rounded-xl
            p-4
            bg-white

            ${selectedCategory ? "hidden lg:block" : "block"}
          `}
        >

          {/* SIDEBAR TITLE */}

          <p className="
            font-bold
            text-[15px]
          ">
            Browse by Category
          </p>

          <p className="
            text-[12px]
            mt-2
            mb-4
            text-gray-500
          ">
            Filter according to what interests you
          </p>


          {/* =================================================
              CATEGORY LIST
          ================================================= */}

          <div className="
            mt-2
            space-y-3
          ">

            {categories.length === 0 ? (

              <p className="
                text-sm
                text-gray-500
                text-center
                py-6
              ">
                No categories available.
              </p>

            ) : (

              categories.map((category) => (

                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    sm:gap-4
                    p-3
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    text-left
                    hover:border-purple-500
                    hover:bg-purple-50
                    transition-all
                    duration-200
                    active:scale-[0.98]
                  "
                >

                  {/* =========================================
                      CATEGORY IMAGE
                  ========================================= */}

                  <div className="
                    w-14
                    h-14
                    sm:w-16
                    sm:h-16
                    flex-shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-gray-100
                  ">

                    {category.image ? (

                      <img
                        src={category.image}
                        alt={category.name}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        text-xs
                      ">
                        No image
                      </div>

                    )}

                  </div>


                  {/* =========================================
                      CATEGORY NAME
                  ========================================= */}

                  <div className="
                    flex-1
                    min-w-0
                  ">

                    <h3 className="
                      font-semibold
                      text-gray-900
                      text-sm
                      sm:text-base
                      truncate
                    ">
                      {category.name}
                    </h3>

                    <p className="
                      text-xs
                      text-gray-500
                      mt-1
                    ">
                      View products
                    </p>

                  </div>


                  {/* =========================================
                      ARROW
                  ========================================= */}

                  <div className="
                    text-purple-600
                    text-xl
                    pr-1
                    flex-shrink-0
                  ">
                    →
                  </div>

                </button>

              ))

            )}

          </div>

        </div>


        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        <div
          className={`
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-sm
            overflow-hidden
            w-full
            lg:flex-1

            ${!selectedCategory ? "hidden lg:block" : "block"}
          `}
        >

          {/* =================================================
              MOBILE BACK BUTTON
          ================================================= */}

          {selectedCategory && (

            <div className="
              lg:hidden
              p-4
              border-b
              bg-gray-50
            ">

              <button
                onClick={() => setSelectedCategory(null)}
                className="
                  text-purple-600
                  font-semibold
                  hover:text-purple-800
                  flex
                  items-center
                  gap-1
                "
              >
                ← Back to Categories
              </button>

            </div>

          )}


          {/* =================================================
              PRODUCT DISPLAY
          ================================================= */}

          <Productdisplay
            selectedCategory={selectedCategory}
          />

        </div>

      </div>

    </section>
  );
}

