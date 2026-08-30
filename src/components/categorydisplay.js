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
return ( <div className="p-6 text-gray-500">
Loading categories... </div>
);
}

if (categories.length === 0) {
return ( <div className="p-6 text-gray-500">
No categories found. </div>
);
}

return ( <div className="p-4 sm:p-6 bg-white rounded-xl">


  {/* ================= HEADER ================= */}

  <h2
    className="
      text-lg
      sm:text-xl
      font-bold
      mb-4
      sm:mb-6
      text-gray-800
    "
  >
    All Categories
  </h2>


  {/* ================= CATEGORY GRID ================= */}

  <div
    className="
      grid
      grid-cols-2
      md:grid-cols-3
      gap-3
      sm:gap-5
      lg:gap-6
    "
  >

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
          p-3
          sm:p-4
          flex
          flex-col
          justify-between
          hover:shadow-md
          hover:border-purple-300
          transition-all
          duration-200
          cursor-pointer
          bg-white
        "
      >

        <div>

          {/* ================= IMAGE ================= */}

          {category.image ? (

            <img
              src={category.image}
              alt={category.name}
              className="
                w-full
                h-28
                sm:h-40
                lg:h-48
                object-cover
                rounded-lg
                mb-3
              "
            />

          ) : (

            <div
              className="
                w-full
                h-28
                sm:h-40
                lg:h-48
                bg-gray-100
                rounded-lg
                mb-3
                flex
                items-center
                justify-center
                text-gray-400
                text-xs
              "
            >
              No image
            </div>

          )}


          {/* ================= CATEGORY NAME ================= */}

          <h3
            className="
              text-sm
              sm:text-lg
              font-semibold
              text-gray-900
              mb-1
              sm:mb-2
            "
          >
            {category.name}
          </h3>


          {/* ================= DESCRIPTION ================= */}

          <p
            className="
              text-xs
              sm:text-sm
              text-gray-600
              line-clamp-2
              mb-3
              sm:mb-4
            "
          >
            {category.description ||
              "No description available."}
          </p>

        </div>


        {/* ================= VIEW PRODUCTS ================= */}

        <Link
          href={`/productspage?category_id=${category.id}`}
          onClick={(event) => event.stopPropagation()}
          className="
            mt-auto
            text-center
            px-2
            sm:px-4
            py-2
            bg-purple-600
            text-white
            text-xs
            sm:text-sm
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
