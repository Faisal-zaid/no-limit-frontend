"use client";

import { useState } from "react";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Categorydisplay from "@/components/categorydisplay";
import Link from "next/link";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    /* 1. Added bg-white (or bg-gray-50) and minimum height so the background is visible */
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover pt-6">
      <div className=" pt-10  items-center text-center">
        <button className="border pt-2 pb-2 pr-3 pl-3 rounded-[30px] justify-center text-center border-purple-700 ">
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
