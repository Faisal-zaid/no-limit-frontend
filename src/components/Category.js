'use client';  //this tells next js this component should run on the client not only in the server side

import { useEffect, useState } from "react";

export default function Categories() {
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
    <div >
      <h2 className="border-b">Categories</h2>

      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
        </div>
      ))}
    </div>
  );
}