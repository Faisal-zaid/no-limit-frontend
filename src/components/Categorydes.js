// here it will hold description for categories

'use client';  //this tells next js this component should run on the client not only in the server side

import { useEffect, useState } from "react";

export default function Categorydescription() {
  const [categories, setCategories] = useState([]);

   useEffect(() => {
    async function loadCategories() {
      const response = await fetch("http://127.0.0.1:8001/category");
      const data = await response.json();

      setCategories(data);
    }

    loadCategories();
  }, []);

  return (
    <div>
     

      {categories.map((category) => (
        <div key={category.id}>
          <h2>Kenya's best {category.name}</h2>
          <div>
          <h3>{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}