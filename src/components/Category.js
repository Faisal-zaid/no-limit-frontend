"use client";

import { useEffect, useState } from "react";

export default function Categories({ onSelectCategory }) {
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);



useEffect(() => {
async function loadCategories() {
try {
const response = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/category`
);


     if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    setCategories(data);
  } catch (error) {
    console.error("Failed to load categories:", error);
  } finally {
    setLoading(false);
  }
}

loadCategories();



}, []);

// LOADING SKELETON
// =========================

if (loading) {
return (
<div className="w-full animate-pulse">
{[1, 2, 3, 4].map((item) => (
<div
key={item}
className="
mt-3
w-full
rounded-xl
border
border-gray-200
bg-white
flex
items-center
gap-3
px-3
py-2

          lg:mt-4
          lg:rounded-lg
        "
      >
        {/* IMAGE SKELETON */}
        <div
          className="
            w-12
            h-12
            bg-gray-200
            rounded-lg
            flex-shrink-0
          "
        />

        {/* TEXT SKELETON */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>

        {/* ARROW SKELETON */}
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    ))}
  </div>
);

}

return ( <div className="w-full">
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
        gap-3
        px-3
        py-2

        lg:mt-4
        lg:rounded-lg
        lg:border-gray-200
      "
    >

      {/* CATEGORY IMAGE */}
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="
            w-12
            h-12
            object-cover
            rounded-lg
            flex-shrink-0
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
          hover:text-white
        "
      >
        {category.name}
      </h3>

      {/* ARROW */}
      <span
        className="
          text-sm
          text-gray-500
          whitespace-nowrap
        "
      >
        View products →
      </span>

    </div>
  ))}
</div>


);
}
