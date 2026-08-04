"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Categorydescription({ selectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("http://127.0.0.1:8001/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load category details:", error);
      }
    }

    loadCategories();
  }, []);

  // Use the clicked category; fallback to the first category from the API response
  const activeCategory = selectedCategory || categories[0];

  return (
    <div>
      {/* Dynamic Header */}
      <h2 className="w-full text-2xl font-bold border-b border-gray-200 pb-3 px-6 pt-4 text-[15px] text-center pb-6">
        Kenya's best{" "}
        <span className="text-purple-600">{activeCategory?.name || "..."}</span>
      </h2>
      <div className="flex px-15 py-3 ">
        <div>
          <p className="text-gray-800 text-[13px] ">
            <span className="border border-none pt-1 text-[18px] pb-1 pl-3 pr-2 rounded-[30px] bg-purple-600 text-white">
              {activeCategory?.name ? `${activeCategory.name}  ` : ""}{" "}
            </span>{" "}
            Trusted across the country
          </p>

          {/* Render Subheading dynamically from backend */}
          {activeCategory?.subheading && (
            <h3 className="text-lg font-semibold mt-2 text-purple-700">
              {activeCategory.subheading}
            </h3>
          )}

          {/* Render Description from backend */}
          {activeCategory ? (
            <div key={activeCategory.id} className="mt-4 pt-4 pb-4 ">
              <p className="text-gray-700">
                {activeCategory.description ||
                  `High quality ${activeCategory.name} products and services.`}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Loading details...</p>
          )}

          {/* Call to Action Buttons */}
          <div className="flex gap-[5%] mt-6">
            <button className="pl-2 pb-1 pr-2 pt-1 items-center text-[10px] bg-purple-600 hover:bg-[white] hover:text-[purple] cursor-pointer text-white rounded-md">
              Shop for Products
            </button>
            <button className="pl-2 pb-1 pr-2 pt-1 items-center hover:bg-[purple] hover:text-[black] cursor-pointer text-[10px] border border-gray-400 rounded-md">
              Get a Quote
            </button>
          </div>
          <div className="flex mt-5 gap-4 text-[11px]">
            <div>
              <ul className="flex items-center">
                <li>
                  <Image
                    src="/images/thunder.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>Expert Designers</li>
              </ul>
            </div>
            <div>
              <ul className="flex items-center">
                <li>
                  <Image
                    src="/images/shield.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>Unlimited Revisions</li>
              </ul>
            </div>
            <div>
              <ul className="flex items-center">
                <li>
                  <Image
                    src="/images/delivery.png"
                    alt="Hero Image"
                    width={25}
                    height={25}
                  />
                </li>
                <li>Fast Turnaround</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
          {/* Render Image from backend if available */}
          {activeCategory?.image && (
            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              className="my-4 max-h-48 object-cover rounded-lg"
            />
          )}
          </div>
          <div>
            {/* Render Image from backend if available */}
          {activeCategory?.image && (
            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              className="my-4 max-h-48 object-cover rounded-lg"
            />
          )}

          {/* Render Image from backend if available */}
          {activeCategory?.image && (
            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              className="my-4 max-h-48 object-cover rounded-lg"
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
