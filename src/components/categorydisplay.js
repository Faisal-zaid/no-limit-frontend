"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Categorydisplay({ selectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("http://127.0.0.1:8001/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load category details:", error);
      }
    }

    loadCategories();
  }, []);

  // Use the clicked category; fallback to the first category from the API response
  const activeCategory = selectedCategory || categories[0];

  return (
   <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h3 onClick={() => onSelectCategory && onSelectCategory(category)}
           className="mt-[18%] rounded-[5px] border border-transparent  pl-[20%] hover:bg-purple-700 hover:border-purple-700 w-[70%] justify-center">{category.name}</h3>
        </div>
      ))}
   </div>
  );
}
