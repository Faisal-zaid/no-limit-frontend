"use client";

import { useState } from "react";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Link from "next/link";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    /* 1. Added bg-white (or bg-gray-50) and minimum height so the background is visible */
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover pt-6">
      <div className=" pt-10 ">
        <button className="border justify-center text-center border-purple-700 ">
          Our Sevices
        </button>
        <h2>Professional Branding Services</h2>
        <p>
          No Limit Brands delivers high-impact branding solutions across Nairobi, Kenya, and East Africa<br/>
          specializing in complete brand identity development, corporate branding, vehicle wraps and matatu <br/>
          graphics, professional signage, promotional printing, packaging design, and corporate stationery for <br/>
          ambitious startups, SMEs, and enterprise corporations.
        </p>
      </div>
      <div className="w-[100%] flex gap-6  p-6 shadow-sm">
        {/* Left Sidebar */}
        <div className="w-1/4 border border-gray-200 rounded-xl p-4 bg-white">
          
          <div>
            <Categories onSelectCategory={setSelectedCategory} />
            <div className="flex justify-center mt-4">
              <Link
                href="/categoriespage"
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                View all Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white">
          <Categorydescription selectedCategory={selectedCategory} />
        </div>
      </div>
    </section>
  );
}
