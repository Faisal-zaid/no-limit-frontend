"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Categorydisplay({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category`
        );

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load category details:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No categories found.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl">

      <h2 className="
        text-lg
        sm:text-xl
        font-bold
        mb-4
        sm:mb-6
        text-gray-800
      ">
        All Categories
      </h2>

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
        sm:gap-6
      ">

        {categories.map((category) => (

          <div
            key={category.id}
            onClick={() =>
              onSelectCategory &&
              onSelectCategory(category)
            }
            className="
              border
              border-gray-200
              rounded-xl
              p-4
              flex
              flex-col
              justify-between
              hover:shadow-md
              transition-shadow
              cursor-pointer
              bg-white
            "
          >

            <div>

              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    w-full
                    h-40
                    sm:h-48
                    object-cover
                    rounded-lg
                    mb-3
                  "
                />
              )}

              <h3 className="
                text-base
                sm:text-lg
                font-semibold
                text-gray-900
                mb-2
              ">
                {category.name}
              </h3>

              <p className="
                text-sm
                text-gray-600
                line-clamp-2
                mb-4
              ">
                {category.description ||
                  "No description available."}
              </p>

            </div>

            <Link
              href={`/categoriespage/${category.id}`}
              className="
                mt-auto
                text-center
                px-4
                py-2
                bg-purple-600
                text-white
                text-sm
                font-medium
                rounded-lg
                hover:bg-purple-700
                transition-colors
              "
            >
              View Products
            </Link>

          </div>

        ))}

      </div>

    </div>
  );
}