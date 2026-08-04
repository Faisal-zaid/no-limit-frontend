"use client";

import { useState } from "react";
import Search from "@/components/Search";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function categoriespage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <section>
     
      <div className="flex border rounded-[20] justify-between ml-[3%] mt-[3%] mr-[3%]">
        <div className="border rounded-[15px] ml-7 mr-7 mt-[3%]">
          <h2 className="border-b px-15 py-3 font-semibold text-lg">
            Categories
          </h2>
          <div className="r ">
            <div className="pl-[25%]">
              <Categories onSelectCategory={setSelectedCategory} />
            </div>
            <div className="flex justify-center align-center mb-3">
            <Link href="/categoriespage"  className="mt-3 pr-3 pl-3 pt-1 pb-1 bg-purple-600 rounded-[6px] hover:bg-[white] hover:text-[purple] cursor-pointer">
              {" "}
              View all Categories
            </Link>
            </div>
          </div>
        </div>
        <div className="mr-7 mt-[3%] border  flex-1 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <Categorydescription selectedCategory={selectedCategory} />
        </div>
      </div>
    </section>
  );
}
