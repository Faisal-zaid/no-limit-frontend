'use client';

import { useEffect, useState } from "react";

export default function Navbar({ onSelectCategory }) {
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
    <div
      className="
        flex
        items-center
        justify-start
        sm:justify-center
        gap-6
        sm:gap-10
        w-full
        overflow-x-auto
        whitespace-nowrap
        px-4
        py-2
        scrollbar-hide
      "
    >
      {categories.slice(0, 8).map((category) => (
        <div key={category.id}>
          <h3
            onClick={() =>
              onSelectCategory &&
              onSelectCategory(category)
            }
            className="
              nav
              cursor-pointer
              hover:text-purple-600
              transition-colors
            "
          >
            {category.name}
          </h3>
        </div>
      ))}
    </div>
  );
}