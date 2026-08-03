'use client';

import { useState } from 'react';
import Search from "@/components/Search";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";

export default function Services() {

  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <section>
      <div>
      <div className="text-[20px] ml-[3%] mt-[5%]">
        <Search />
      </div>
      <div>
        <div>All Products</div>
        <div></div>
        <div>Shop All</div>
      </div>
      </div>

      <div className="flex justify-between">
        <div className="border ml-[5%] mt-[3%]">
          <h2 className="border-b px-15 py-3 font-semibold text-lg">
            Categories
          </h2>
          <div className="pl-[35%] ">
            <Categories onSelectCategory={setSelectedCategory}/>
          </div>
        </div>
        <div className="category info">
          <Categorydescription selectedCategory={selectedCategory}/>
        </div>
      </div>
    </section>
  );
}
