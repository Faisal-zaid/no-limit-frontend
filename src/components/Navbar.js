
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadCategories();
  }, []);

  // =====================================================
  // HANDLE CATEGORY CLICK
  // =====================================================

  function handleCategoryClick(category) {
    /*
      If the parent component provided onSelectCategory,
      use it.

      This is useful on your Services page where clicking
      a category should display its description.
    */

    if (onSelectCategory) {
      onSelectCategory(category);
      return;
    }

    /*
      Otherwise, navigate to the products page for
      this category.
    */

    router.push(
      `/productspage?category=${encodeURIComponent(category.id)}`
    );
  }

  return (
    <nav
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
        <button
          key={category.id}
          type="button"
          onClick={() => handleCategoryClick(category)}
          className="
            nav
            cursor-pointer
            hover:text-purple-600
            transition-colors
            bg-transparent
            border-0
            p-0
            whitespace-nowrap
          "
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}

