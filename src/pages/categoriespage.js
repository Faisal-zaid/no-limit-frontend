"use client";

import { useState } from "react";
import Categories from "@/components/Category";
import Categorydescription from "@/components/Categorydes";
import Link from "next/link";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    /* 1. Added bg-white (or bg-gray-50) and minimum height so the background is visible */
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover p-6">
      <div className="max-w-7xl mx-auto flex gap-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        
        {/* Left Sidebar */}
        <div className="w-1/4 border border-gray-200 rounded-xl p-4 bg-white">
          <h2 className="border-b pb-3 mb-4 font-semibold text-lg text-gray-800">
            Categories
          </h2>
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