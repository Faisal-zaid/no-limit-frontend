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

  return (
    <div>
     <h2>Kenya's best {activeCategoryName}</h2>
      <p>Trusted across the country</p>

      {categories.map((category) => (
        
        <div key={category.id}>
          
     
          <h3>{category.name}</h3>
         
          
        </div>
      ))}
    </div>
  );
}