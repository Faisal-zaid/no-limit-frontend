"use client";

import { useState } from "react";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Categorydisplay from "@/components/categorydisplay";
import Link from "next/link";
import Search from "@/components/Search";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  

  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover ">
      <div className="bg-white border-b-gray-700 shadow-xl text-gray-700 pb-3 mt-0">
        <div className="flex gap-[40%] text-[20px] ml-[3%] mt-0 pt-[1%]">
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

      {/* this is where content outside navbar begins */}
      <div className=" pt-10  items-center text-center">
        <button className="border pt-2 pb-2 pr-3 pl-3 rounded-[30px] justify-center text-center border-purple-700 bg-purple-600 ">
          <ul className="flex items-center">
            <li>
              <Image
                src="/images/star.png"
                alt="Hero Image"
                width={25}
                height={25}
              />
            </li>
            <li>Categories</li>
          </ul>
        </button>
        <h2 className="font-bold text-[25px]">
          Professional Branding Services
        </h2>
        <p>
          <span className="font-bold">No Limit Brands</span> delivers
          high-impact branding solutions across
          <span className="font-bold">Nairobi, Kenya, and East Africa</span>
          <br />
          specializing in{" "}
          <span className="font-bold">complete brand identity</span>{" "}
          development, corporate branding, vehicle wraps and matatu <br />
          graphics, professional signage, promotional printing, packaging
          design, and corporate stationery for <br />
          ambitious startups, SMEs, and enterprise corporations.
        </p>
      </div>
      <div className="w-[100%] gap-6  p-6 shadow-sm">
        {/* Left Sidebar */}
        <div className=" border border-gray-200 rounded-xl p-4 bg-white">
          <div>
            <Categorydisplay onSelectCategory={setSelectedCategory} />
          </div>
        </div>
       
      </div>
    </section>
  );
}
