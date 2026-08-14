"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Categorydescription({ selectedCategory }) {
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
        console.error("Failed to load category details:", error);
      }
    }

    loadCategories();
  }, []);

  // Use clicked category, otherwise use first category
  const activeCategory = selectedCategory || categories[0];

  return (
    <div className="w-full">

      {/* HEADER */}
      <h2
        className="
          w-full
          text-xl
          sm:text-2xl
          font-bold
          border-b
          border-gray-200
          px-4
          sm:px-6
          pt-4
          pb-4
          text-center
        "
      >
        Kenya's best{" "}
        <span className="text-purple-600">
          {activeCategory?.name || "..."}
        </span>
      </h2>

      {/* MAIN CONTENT */}
      <div
        className="
          flex
          flex-col
          lg:flex-row
          gap-6
          px-4
          sm:px-6
          lg:px-10
          py-5
        "
      >

        {/* LEFT / TEXT CONTENT */}
        <div className="w-full lg:w-1/2">

          {/* Category name + trusted */}
          <p className="text-gray-800 text-sm sm:text-base">

            {activeCategory?.name && (
              <span
                className="
                  inline-block
                  border-none
                  px-3
                  py-1
                  rounded-full
                  bg-purple-600
                  text-white
                  text-sm
                  sm:text-base
                "
              >
                {activeCategory.name}
              </span>
            )}

            <span className="ml-2">
              Trusted across the country
            </span>

          </p>


          {/* SUBHEADING */}
          {activeCategory?.subheading && (
            <h3
              className="
                text-lg
                sm:text-xl
                font-semibold
                mt-3
                text-purple-700
              "
            >
              {activeCategory.subheading}
            </h3>
          )}


          {/* DESCRIPTION */}
          {activeCategory ? (
            <div className="mt-4 py-2">

              <p
                className="
                  text-gray-700
                  text-sm
                  sm:text-base
                  leading-relaxed
                "
              >
                {activeCategory.description ||
                  `High quality ${activeCategory.name} products and services.`}
              </p>

            </div>
          ) : (
            <p className="text-gray-400">
              Loading details...
            </p>
          )}


          {/* BUTTONS */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
              mt-6
            "
          >

            <button
              className="
                px-4
                py-2
                text-sm
                bg-purple-600
                hover:bg-purple-700
                text-white
                rounded-md
                w-full
                sm:w-auto
              "
            >
              Shop for Products
            </button>

            <button
              className="
                px-4
                py-2
                text-sm
                border
                border-gray-400
                hover:bg-purple-600
                hover:text-white
                rounded-md
                w-full
                sm:w-auto
              "
            >
              Get a Quote
            </button>

          </div>


          {/* FEATURES */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              flex-wrap
              gap-4
              mt-6
              text-xs
              sm:text-sm
            "
          >

            {/* Expert Designers */}
            <div>
              <ul className="flex items-center gap-1">
                <li>
                  <Image
                    src="/images/thunder.png"
                    alt="Expert Designers"
                    width={25}
                    height={25}
                  />
                </li>

                <li>
                  Expert Designers
                </li>
              </ul>
            </div>


            {/* Unlimited Revisions */}
            <div>
              <ul className="flex items-center gap-1">
                <li>
                  <Image
                    src="/images/shield.png"
                    alt="Unlimited Revisions"
                    width={25}
                    height={25}
                  />
                </li>

                <li>
                  Unlimited Revisions
                </li>
              </ul>
            </div>


            {/* Fast Turnaround */}
            <div>
              <ul className="flex items-center gap-1">
                <li>
                  <Image
                    src="/images/delivery.png"
                    alt="Fast Turnaround"
                    width={25}
                    height={25}
                  />
                </li>

                <li>
                  Fast Turnaround
                </li>
              </ul>
            </div>

          </div>

        </div>


        {/* RIGHT / IMAGE */}
        <div
          className="
            w-full
            lg:w-1/2
            flex
            justify-center
            items-center
          "
        >

          {activeCategory?.image && (
            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              className="
                w-full
                max-w-md
                h-48
                sm:h-56
                lg:h-64
                object-cover
                rounded-lg
              "
            />
          )}

        </div>

      </div>

    </div>
  );
}