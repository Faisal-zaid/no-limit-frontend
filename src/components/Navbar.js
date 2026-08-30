"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const navRef = useRef(null);
  const animationRef = useRef(null);
  const isUserInteracting = useRef(false);

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
  // MOBILE AUTO SCROLL
  // =====================================================

  useEffect(() => {
    // Don't run until categories have loaded
    if (categories.length === 0) {
      return;
    }

    // Only run auto-scroll on mobile
    if (window.innerWidth >= 640) {
      return;
    }

    const nav = navRef.current;

    if (!nav) {
      return;
    }

    function autoScroll() {
      if (!isUserInteracting.current) {
        nav.scrollLeft += 0.5;

        // When we reach the end, go back to the beginning
        if (
          nav.scrollLeft + nav.clientWidth >=
          nav.scrollWidth - 1
        ) {
          nav.scrollLeft = 0;
        }
      }

      animationRef.current =
        requestAnimationFrame(autoScroll);
    }

    animationRef.current =
      requestAnimationFrame(autoScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [categories]);

  // =====================================================
  // PAUSE AUTO SCROLL WHEN USER INTERACTS
  // =====================================================

  function pauseAutoScroll() {
    isUserInteracting.current = true;
  }

  function resumeAutoScroll() {
    isUserInteracting.current = false;
  }

  // =====================================================
  // HANDLE CATEGORY CLICK
  // =====================================================

  function handleCategoryClick(category) {
    if (onSelectCategory) {
      onSelectCategory(category);
      return;
    }

    router.push(
      `/productspage?category=${encodeURIComponent(category.id)}`
    );
  }

  return (
    <nav
      ref={navRef}
      onTouchStart={pauseAutoScroll}
      onTouchEnd={resumeAutoScroll}
      onMouseDown={pauseAutoScroll}
      onMouseUp={resumeAutoScroll}
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

        scroll-smooth
      "
    >
      {categories.slice(0, 8).map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() =>
            handleCategoryClick(category)
          }
          className="
            nav
            cursor-pointer
            hover:text-purple-600
            transition-colors
            bg-transparent
            border-0
            p-0
            whitespace-nowrap
            flex-shrink-0
          "
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}