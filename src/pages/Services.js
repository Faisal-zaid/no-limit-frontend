"use client";

import { useState } from "react";
import Search from "@/components/Search";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <section>
      <div className="bg-white border-b-gray-700 shadow-xl text-gray-700 pb-3">
        <div className="flex gap-[40%] text-[20px] ml-[3%] mt-[5%] pt-[1%]">
          <div className="flex gap-[10%]">
            <ul className="flex justify-between items-center text-sm font-medium font-black">
              <li>
                <Image
                  src="/images/nolimit-logo.png"
                  alt="Hero Image"
                  width={77}
                  height={75}
                />
              </li>
            </ul>
            <Search />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <ul className="flex items-center">
                <li>
                  <Image
                    src="/images/info.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>About</li>
              </ul>
            </div>
            <div>
              <ul className="flex items-center">
                <li>
                  <Image
                    src="/images/Cart--Streamline-Platinum.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>Cart</li>
              </ul>
            </div>
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              <ul className="flex items-center">
                <li>
                  <Image
                    src="/images/login.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>SignIn</li>
              </ul>
            </button>
          </div>
        </div>
        <div className="flex ml-[3%] items-center mt-6 justify-between mr-[3%]">
          <div className="pr-3 pl-3 pt-2 pb-2 bg-gray-100 rounded-[10px]">
            <ul className="flex items-center gap-3">
                <li>
                  <Image
                    src="/images/menu.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>All Products</li>
              </ul>
               </div>
          <div className="flex-1 flex justify-center mx-4 overflow-hidden">
            <Navbar />
          </div>
          <div className="ml text-purple-600">Shop All</div>
        </div>
      </div>

      <div className="flex border rounded-[20] justify-between ml-[3%] mt-[3%] mr-[3%]">
        <div className="border rounded-[15px] ml-7 mr-7 mt-[3%]">
          <h2 className="border-b px-15 py-3 font-semibold text-lg">
            Categories
          </h2>
          <div className="pl-[35%] ">
            <Categories onSelectCategory={setSelectedCategory} />
            <button className="mt-3 pr-3 pl-3 pt-1 pb-1 bg-purple-600 rounded-[6px]"> View all Services</button>
          </div>
        </div>
        <div className="mr-7 mt-[3%] border  flex-1 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <Categorydescription selectedCategory={selectedCategory} />
        </div>
      </div>
    </section>
  );
}
