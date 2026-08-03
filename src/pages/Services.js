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
      <div>
        <div className="flex gap-[55%] text-[20px] ml-[3%] mt-[5%]">
          <div>
            <Search />
          </div>
          <div className="flex gap-[10%]">
            <div>
              <ul className="flex">
                <li>
                  <Image
                                  src="/images/Cart--Streamline-Platinum.png"
                                  alt="Hero Image"
                                  width={25}
                                  height={25}
                                />
                </li>
                <li>About</li>
              </ul>
            </div>
            <div>
              <ul className="flex">
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
          </div>
        </div>
        <div className="flex ml-[3%] items-center justify-between mr-[3%]">
          <div className="mr">All Products </div>
          <div>
            <Navbar />
          </div>
          <div className="ml">Shop All</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="border ml-[5%] mt-[3%]">
          <h2 className="border-b px-15 py-3 font-semibold text-lg">
            Categories
          </h2>
          <div className="pl-[35%] ">
            <Categories onSelectCategory={setSelectedCategory} />
          </div>
        </div>
        <div className="category info">
          <Categorydescription selectedCategory={selectedCategory} />
        </div>
      </div>
    </section>
  );
}
