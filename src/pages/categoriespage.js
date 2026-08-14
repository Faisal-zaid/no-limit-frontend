"use client";

import { useState } from "react";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Categorydisplay from "@/components/categorydisplay";
import Link from "next/link";
import SearchWrapper from "@/components/SearchWrapper";
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
            <SearchWrapper />
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
        <div className=" border border-gray-200 rounded-xl p-4 bg-white mt-15 flex flex-col items-center">
          <h2 className="font-bold text-[18px]">
            Ready to Transform your Brand?
          </h2>
          <p>Contact us for a free Consultation</p>
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M0 0h512v512H0z" fill="none" />
              <path
                fill="#b3b3b3"
                d="m143.8 431.2l7.7 4.5c32.2 19.1 69.2 29.2 106.8 29.2h.1c115.7 0 209.8-94.1 209.9-209.8c0-56.1-21.8-108.8-61.4-148.4c-39.3-39.5-92.7-61.7-148.4-61.5c-115.8 0-209.9 94.1-210 209.8c-.1 39.5 11.1 78.2 32.1 111.7l5 7.9L64.4 452zM3.7 512l35.8-130.8C17.5 342.9 5.8 299.5 5.9 255C5.9 115.8 119.2 2.6 258.4 2.6c67.5 0 130.9 26.3 178.6 74s73.9 111.1 73.9 178.6c-.1 139.2-113.3 252.4-252.5 252.4h-.1c-42.3 0-83.8-10.6-120.7-30.7z"
              />
              <path
                fill="#fff"
                d="M1.1 509.4L37 378.6C14.8 340.2 3.2 296.7 3.3 252.4C3.3 113.2 116.6 0 255.8 0c67.5 0 130.9 26.3 178.6 74s73.9 111.1 73.9 178.6C508.2 391.8 394.9 505 255.8 505h-.1c-42.3 0-83.8-10.6-120.7-30.7z"
              />
              <linearGradient
                id="SVGshpjYc9B"
                x1="254.658"
                x2="256.786"
                y1="345.363"
                y2="704.074"
                gradientTransform="translate(0 -277.552)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#57d163" />
                <stop offset="1" stop-color="#23b33a" />
              </linearGradient>
              <path
                fill="url(#SVGshpjYc9B)"
                d="M255.8 42.6c-115.8 0-209.9 94.1-210 209.8c0 39.5 11.2 78.2 32.2 111.7l5 7.9l-21.2 77.4l79.4-20.8l7.7 4.5c32.2 19.1 69.2 29.2 106.8 29.2h.1c115.7 0 209.8-94.1 209.9-209.8c.2-55.7-21.9-109.1-61.4-148.4c-39.3-39.4-92.8-61.6-148.5-61.5"
              />
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M192.7 146.9c-4.7-10.5-9.7-10.7-14.2-10.9l-12.1-.1c-4.2 0-11 1.6-16.8 7.9s-22.1 21.6-22.1 52.6s22.6 61 25.8 65.2s43.6 69.9 107.8 95.2c53.3 21 64.1 16.8 75.7 15.8c11.6-1.1 37.3-15.3 42.6-30s5.3-27.4 3.7-30s-5.8-4.2-12.1-7.4s-37.3-18.4-43.1-20.5s-10-3.2-14.2 3.2c-4.2 6.3-16.3 20.5-20 24.7s-7.4 4.7-13.7 1.6c-6.3-3.2-26.6-9.8-50.7-31.3c-18.8-16.7-31.4-37.4-35.1-43.7s-.4-9.7 2.8-12.9c2.8-2.8 6.3-7.4 9.5-11.1s4.2-6.3 6.3-10.5s1.1-7.9-.5-11.1c-1.8-3-14-34.2-19.6-46.7"
              />
            </svg>
            Chat with Us
          </Link>
        </div>
      </div>
    </section>
  );
}
