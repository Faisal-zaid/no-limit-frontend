'use client';

import { useEffect, useState } from "react";

export default function Categorydescription({ selectedCategory }) {
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
      {/* Dynamic Header */}
      <h2 className="text-2xl font-bold">
        Kenya's best {activeCategory?.name || "..."}
      </h2>
      <p className="text-gray-500">
        {activeCategory?.name ? `${activeCategory.name} - ` : ""}Trusted across the country
      </p>

      {/* Render Subheading dynamically from backend */}
      {activeCategory?.subheading && (
        <h3 className="text-lg font-semibold mt-2 text-purple-700">
          {activeCategory.subheading}
        </h3>
      )}

      {/* Render Image from backend if available */}
      {activeCategory?.image && (
        <img 
          src={activeCategory.image} 
          alt={activeCategory.name} 
          className="my-4 max-h-48 object-cover rounded-lg"
        />
      )}

      {/* Render Description from backend */}
      {activeCategory ? (
        <div key={activeCategory.id} className="mt-4 p-4 border rounded-md">
          <p className="text-gray-700">
            {activeCategory.description || `High quality ${activeCategory.name} products and services.`}
          </p>
        </div>
      ) : (
        <p className="text-gray-400">Loading details...</p>
      )}

      {/* Call to Action Buttons */}
      <div className="flex gap-[5%] mt-6">
        <button className="px-4 py-2 bg-black text-white rounded-md">
          Shop for Products
        </button>
        <button className="px-4 py-2 border border-gray-400 rounded-md">
          Get a Quote
        </button>
      </div>
    </div>
  );
}