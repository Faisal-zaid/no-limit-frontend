'use client';  //this tells next js this component should run on the client not only in the server side

import { useEffect, useState } from "react";

export default function Categories({onSelectCategory}) {
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
     

      {categories.slice(0,4).map((category) => (
        <div key={category.id}>
          <h3 onClick={() => onSelectCategory && onSelectCategory(category)}
           className="mt-[18%] rounded-[5px] border border-transparent  pl-[20%] hover:bg-purple-700 hover:border-purple-700 w-[70%] justify-center">{category.name}</h3>
        </div>
      ))}
    </div>
  );
}