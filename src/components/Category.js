'use client';

import { useEffect, useState } from "react";

export default function Categories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category`
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
    <div className="w-full">
      {categories.slice(0, 4).map((category) => (
        <div
          key={category.id}
          onClick={() =>
            onSelectCategory && onSelectCategory(category)
          }
          className="
            mt-3
            w-full
            cursor-pointer
            rounded-xl
            border
            border-gray-200
            bg-white
            transition
            hover:bg-purple-700
            hover:text-white

            flex
            items-center
            gap-4
            px-4
            py-3

            lg:mt-[10%]
            lg:rounded-[5px]
            lg:border-transparent
            lg:px-4
            lg:py-3
            lg:block
            lg:text-center
          "
        >

          {/* CATEGORY IMAGE */}
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="
                w-14
                h-14
                object-cover
                rounded-lg
                flex-shrink-0

                lg:w-full
                lg:h-24
                lg:mb-2
              "
            />
          )}

          {/* CATEGORY NAME */}
          <h3
            className="
              flex-1
              text-left
              font-medium
              text-gray-800

              lg:text-center
              lg:text-base
            "
          >
            {category.name}
          </h3>

          {/* ARROW - MOBILE */}
          <span
            className="
              text-xl
              text-gray-500

              lg:hidden
            "
          >
           View products →
          </span>

        </div>
      ))}
    </div>
  );
}