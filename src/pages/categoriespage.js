"use client";

import { useState } from "react";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Categorydisplay from "@/components/categorydisplay";
import Link from "next/link";
import Search from "@/components/Search";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const phoneNumber = "254780887324";

  // Optional pre-filled message (use encodeURIComponent so spaces/symbols format correctly in the URL)
  const defaultMessage = encodeURIComponent(
    "Hello No Limit Brands! I would like to consult on your branding services.",
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

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
        <h2 className="font-bold text-[25px]">Professional Branding Services</h2>
        <p>
          <span className="font-bold">No Limit Brands</span> delivers high-impact branding solutions across
          <span className="font-bold">Nairobi, Kenya, and East Africa</span>
          <br />
          specializing in <span className="font-bold">complete brand identity</span> development, corporate
          branding, vehicle wraps and matatu <br />
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
        <div className=" border border-gray-200 rounded-xl p-4 bg-white mt-15 flex flex-col items-center">
            <h2 className="font-bold text-[18px]">Ready to Transform your Brand?</h2>
            <p>Contact us for a free Consultation</p>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 cursor-pointer"
            >
              {/* Optional WhatsApp SVG Icon */}
              <svg
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              Chat with Us
            </Link>
          </div>
      </div>
    </section>
  );
}
