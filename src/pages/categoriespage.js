
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

  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">

      {/* =====================================================
          HEADER
          ===================================================== */}
      <header className="bg-white shadow-xl text-gray-700 pb-4">

        {/* =====================================================
            TOP HEADER
            ===================================================== */}
        <div className="px-4 sm:px-6 lg:px-[3%] pt-4">

          <div className="
            flex
            items-center
            justify-between
            gap-4
          ">

            {/* =================================================
                LOGO
                ================================================= */}
            <Link href="/">
              <Image
                src="/images/nolimit-logo.png"
                alt="No Limit Brands"
                width={77}
                height={75}
                className="w-[65px] h-auto sm:w-[77px]"
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

                <span>
                  About
                </span>

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
              NAVIGATION
              ===================================================== */}
          <div className="
            flex
            items-center
            justify-between
            gap-3
            mt-5
          ">

            {/* =================================================
                ALL PRODUCTS
                ================================================= */}
            <Link
              href="/productspage"
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-gray-100
                hover:bg-gray-200
                rounded-[10px]
                px-3
                py-2
                whitespace-nowrap
                transition
                flex-shrink-0
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
                NAVBAR
                ================================================= */}
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

      </header>


      {/* =====================================================
          INTRO
          ===================================================== */}
      <div className="
        px-4
        sm:px-6
        pt-8
        sm:pt-10
        text-center
      ">

        {/* CATEGORY BADGE */}
        <button className="
          inline-flex
          items-center
          gap-2
          border
          border-purple-700
          rounded-full
          px-4
          py-2
          bg-purple-600
          text-white
        ">

          <Image
            src="/images/star.png"
            alt="Categories"
            width={20}
            height={20}
          />

          <span>
            Categories
          </span>

        </button>


        {/* HEADING */}
        <h2 className="
          font-bold
          text-xl
          sm:text-2xl
          mt-4
        ">
          Professional Branding Services
        </h2>


        {/* DESCRIPTION */}
        <p className="
          mt-3
          text-sm
          sm:text-base
          leading-relaxed
          max-w-4xl
          mx-auto
        ">

          <span className="font-bold">
            No Limit Brands
          </span>{" "}

          delivers high-impact branding solutions across{" "}

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


      {/* =====================================================
          CATEGORIES
          ===================================================== */}
      <div className="
        px-4
        sm:px-6
        lg:px-8
        py-8
      ">

        <div className="
          border
          border-gray-200
          rounded-xl
          p-4
          sm:p-6
          bg-white
        ">

          <Categorydisplay
            onSelectCategory={setSelectedCategory}
          />

        </div>


        {/* =================================================
            CONTACT
            ================================================= */}
        <div className="
          border
          border-gray-200
          rounded-xl
          p-5
          sm:p-6
          bg-white
          mt-8
          flex
          flex-col
          items-center
          text-center
        ">

          <h2 className="
            font-bold
            text-lg
            sm:text-xl
          ">
            Ready to Transform Your Brand?
          </h2>


          <p className="
            mt-1
            text-sm
            sm:text-base
            text-gray-600
          ">
            Contact us for a free consultation
          </p>


          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              mt-4
              px-6
              py-3
              bg-green-600
              text-white
              font-semibold
              rounded-lg
              shadow-md
              hover:bg-green-700
              transition
              w-full
              sm:w-auto
            "
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

