"use client";

import { useState, useEffect } from "react";
import Categories from "@/components/Category";
import Productdisplay from "@/components/Productdisplay";
import Categorydisplay from "@/components/categorydisplay";
import Link from "next/link";
import Search from "@/components/Search";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
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
            <li>Products</li>
          </ul>
        </button>
        <h2 className="font-bold text-[25px]">Shop by Category</h2>
        <p>Check our Products by Category to find what you woud Like</p>
      </div>
      <div className="w-[100%] gap-6 flex p-6 shadow-sm">
        {/* Left Sidebar */}
        <div className=" border w-[20%] border-gray-200 rounded-xl p-4 bg-white">
          <p className="font-bold text-[15px]">Browse by Category</p>
            <p>Filter according to what interests you</p>
            <Search/>
          <div>
            
            {categories.map((category) => (
              <div key={category.id}>
                <h3
                  onClick={() => setSelectedCategory(category)}
                  className="mt-[10%] rounded-[5px] border border-transparent  pl-[20%] hover:bg-purple-700 hover:border-purple-700 w-[70%] justify-center"
                >
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
        {/* right side */}
        <div className="bg-white border  flex-1 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <Productdisplay selectedCategory={selectedCategory} />
        </div>
      </div>
    </section>
  );
}
