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
      <div className="bg-white shadow-xl text-gray-700 pb-3">

        {/* TOP ROW */}
        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          lg:gap-0
          px-[3%]
          pt-4
        ">

          {/* LOGO + SEARCH */}
          <div className="
            flex
            flex-col
            sm:flex-row
            items-center
            gap-4
            sm:gap-8
          ">

            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit Brands logo"
              width={77}
              height={75}
            />

            <SearchWrapper />

          </div>


          {/* RIGHT SIDE */}
          <div className="
            flex
            justify-center
            sm:justify-end
            items-center
            gap-4
            text-sm
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
            <button className="
              flex
              items-center
              gap-1
              bg-purple-600
              hover:bg-purple-700
              text-white
              font-medium
              px-4
              py-1.5
              rounded-lg
              transition-colors
            ">

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


        {/* ================= NAVIGATION ================= */}
        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          gap-4
          lg:gap-0
          px-[3%]
          mt-6
        ">

          {/* ALL PRODUCTS */}
          <div className="
            bg-gray-100
            hover:bg-gray-200
            rounded-[10px]
            px-3
            py-2
            w-fit
          ">

            <Link
              href="/productspage"
              className="
                flex
                items-center
                gap-3
                hover:text-purple-600
                cursor-pointer
              "
            >

              <Image
                src="/images/menu.png"
                alt="Menu"
                width={25}
                height={25}
              />

              <span>All Products</span>

            </Link>

          </div>


          {/* NAVBAR */}
          <div className="
            flex-1
            flex
            justify-center
            overflow-hidden
          ">
            <Navbar />
          </div>


          {/* SHOP ALL */}
          <div className="text-purple-600 w-fit">
            <Link
              href="/categoriespage"
              className="
                hover:text-purple-800
                cursor-pointer
              "
            >
              Shop All
            </Link>
          </div>

        </div>

      </div>


      {/* ================= SERVICES CONTENT ================= */}
      <div className="
        flex
        flex-col
        lg:flex-row
        border
        rounded-[20px]
        mx-[3%]
        mt-6
        lg:mt-[3%]
        gap-6
        p-4
        lg:p-0
      ">

        {/* ================= CATEGORIES ================= */}
        <div className="
          border
          rounded-[15px]
          w-full
          lg:w-auto
          lg:min-w-[280px]
          lg:ml-7
          lg:mr-7
          lg:mt-[3%]
        ">

          <h2 className="
            border-b
            px-6
            lg:px-15
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
              lg:pl-[25%]
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
          w-full
          lg:flex-1
          border
          border-gray-200
          rounded-xl
          shadow-sm
          overflow-hidden
          lg:mr-7
          lg:mt-[3%]
        ">

          <Categorydescription
            selectedCategory={selectedCategory}
          />

        </div>

      </div>

    </section>
  );
}