'use client';  //this tells next js this component should run on the client not only in the server side

import { useEffect, useState } from "react";

export default function Navbar({onSelectCategory}) {
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
    <div className="flex" >
     

      {categories.map((category) => (
        <div key={category.id} >
          <h3 onClick={() => onSelectCategory && onSelectCategory(category)}
           className="nav">{category.name}</h3>
        </div>
      ))}
    </div>
  );
}