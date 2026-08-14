"use client";

import { useEffect, useState } from "react";

export default function Categories({ onSelectCategory }) {
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
    <div className="w-full">
      {categories.map((category) => (
        <div
          key={category.id}
          className="w-full"
        >
          <h3
            onClick={() =>
              onSelectCategory &&
              onSelectCategory(category)
            }
            className="
              mt-3
              px-4
              py-3
              w-full
              text-center
              rounded-lg
              cursor-pointer
              hover:bg-purple-700
              hover:text-white
              transition
            "
          >
            {category.name}
          </h3>
        </div>
      ))}
    </div>
  );
}