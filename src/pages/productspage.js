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
          "http://127.0.0.1:8001/category"
        );

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="bg-white border-b border-gray-700 shadow-xl text-gray-700 pb-3">

        {/* TOP NAVIGATION */}

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mx-[3%]
          pt-3
        ">

          {/* LOGO + SEARCH */}

          <div className="
            flex
            flex-col
            sm:flex-row
            items-center
            gap-4
            sm:gap-8
            w-full
            lg:w-auto
          ">

            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit Brands logo"
              width={77}
              height={75}
            />

            <div className="w-full sm:w-auto">
              <SearchWrapper />
            </div>

          </div>


          {/* ABOUT / CART / SIGN IN */}

          <div className="
            flex
            items-center
            justify-center
            sm:justify-end
            gap-4
            sm:gap-6
            text-sm
            sm:text-base
            w-full
            lg:w-auto
          ">

            {/* ABOUT */}

            <div>
              <ul className="flex items-center gap-1">
                <li>
                  <Image
                    src="/images/info.png"
                    alt="About"
                    width={25}
                    height={25}
                  />
                </li>

                <li>About</li>
              </ul>
            </div>


            {/* CART */}

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


            {/* SIGN IN */}

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
                py-1.5
                rounded-lg
                transition-colors
              "
            >
              <Image
                src="/images/login.png"
                alt="Sign in"
                width={25}
                height={25}
              />

              <span>SignIn</span>
            </button>

          </div>

        </div>


        {/* SECOND NAVIGATION */}

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          gap-4
          lg:gap-0
          mx-[3%]
          mt-5
        ">

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


          {/* CATEGORY NAVBAR */}

          <div className="
            flex-1
            flex
            justify-center
            mx-0
            lg:mx-4
            overflow-x-auto
            w-full
          ">
            <Navbar />
          </div>


          {/* SHOP ALL */}

          <div className="
            text-purple-600
            text-center
            lg:text-right
            w-full
            lg:w-auto
          ">
            <Link href="/categoriespage">
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

        <button
          className="
            border
            py-2
            px-3
            rounded-[30px]
            border-purple-700
            bg-purple-600
            text-white
          "
        >
          <ul className="flex items-center gap-2">
            <li>
              <Image
                src="/images/star.png"
                alt="Products"
                width={25}
                height={25}
              />
            </li>

            <li>Products</li>
          </ul>
        </button>


        <h2 className="
          font-bold
          text-[22px]
          sm:text-[25px]
          mt-3
        ">
          Shop by Category
        </h2>


        <p className="
          text-sm
          sm:text-base
          mt-2
        ">
          Check our Products by Category to find what you would like
        </p>

      </div>


      {/* =====================================================
          SIDEBAR + PRODUCTS
      ====================================================== */}

      <div className="
        w-full
        flex
        flex-col
        lg:flex-row
        gap-6
        p-4
        sm:p-6
      ">

        {/* =================================================
            LEFT SIDEBAR
        ================================================== */}

        <div className="
          border
          border-gray-200
          rounded-xl
          p-4
          bg-white
          w-full
          lg:w-[25%]
          lg:min-w-[250px]
        ">

          <p className="font-bold text-[15px]">
            Browse by Category
          </p>

          <p className="
            text-[12px]
            mt-2
            mb-3
            text-gray-600
          ">
            Filter according to what interests you
          </p>


          {/* SEARCH */}

          <div className="w-full mb-5">
            <SearchWrapper />
          </div>


          {/* CATEGORIES */}

          <div className="space-y-4">

            {categories.map((category) => (

              <div
                key={category.id}
                className="
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                  rounded-lg
                  p-2
                  hover:bg-purple-50
                  transition-colors
                "
                onClick={() =>
                  setSelectedCategory(category)
                }
              >

                {/* CATEGORY IMAGE */}

                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                      w-14
                      h-14
                      sm:w-16
                      sm:h-16
                      object-cover
                      rounded-lg
                      shrink-0
                    "
                  />
                )}


                {/* CATEGORY NAME */}

                <h3 className="
                  text-sm
                  sm:text-base
                  font-medium
                  text-gray-800
                  hover:text-purple-600
                ">
                  {category.name}
                </h3>

              </div>

            ))}

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE / PRODUCTS
        ================================================== */}

        <div className="
          bg-white
          border
          border-gray-200
          rounded-xl
          shadow-sm
          overflow-hidden
          w-full
          lg:flex-1
        ">

          <Productdisplay
            selectedCategory={selectedCategory}
          />

        </div>

      </div>

    </section>
  );
}