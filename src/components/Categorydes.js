// here it will hold description for categories

'use client';  //this tells next js this component should run on the client not only in the server side

import { useEffect, useState } from "react";

export default function Categorydescription({ selectedCategory }) {
  const [categories, setCategories] = useState([]);

   useEffect(() => {
    async function loadCategories() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setCategories(data);
    }

    loadCategories();
  }, []);

  // Use the selected category name if clicked, otherwise default to the first fetched category
  const activeCategoryName = selectedCategory?.name || categories[0]?.name || "...";

  const activeCategory = selectedCategory || categories[0]; // this helps in writing the description
  return (
    <div>
     <h2>Kenya's best {activeCategoryName}</h2>
      <p>{activeCategoryName} Trusted across the country</p>
      <h2>category.subheading</h2>

      {activeCategory ? (
        <div key={activeCategory.id} className="mt-4 p-4 border rounded-md">
          <p className="text-gray-700">
            {activeCategory.description || `High quality ${activeCategory.name} products and services.`}
          </p>
        </div>
      ) : (
        <p className="text-gray-400">Loading details...</p>
      )}
      <div className="flex gap-[5%]">
        <button>Shop for Products</button>
        <button>Get a Quote</button>
      </div>
    </div>
  );
}