import { useState } from 'react';
import Search from "@/components/Search";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";

export default function Services() {
  return (
    <section>
      <div className="text-[20px] ml-[3%] mt-[5%]">
        <Search />
      </div>

      <div className="flex justify-between">
        <div className="border ml-[5%] mt-[3%]">
          <h2 className="border-b px-15 py-3 font-semibold text-lg">
            Categories
          </h2>
          <div className="pl-[35%] ">
            <Categories />
          </div>
        </div>
        <div className="category info">
          <Categorydescription />
        </div>
      </div>
    </section>
  );
}
