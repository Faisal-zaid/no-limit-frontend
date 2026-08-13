"use client";

import CategoryManager from "@/admin/categorymanager";
import ProductManager from "@/admin/productmanager";

export default function Admin() {
  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover bg-fixed">

      {/* Header */}
      <div className="flex justify-between items-center ml-7 mr-7 py-5">
        
        <div></div>

        <div>
          <h2 className="text-[30px] font-semibold">
            Admin Panel
          </h2>
        </div>

        <div>
          <button className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l-2.55-2.55L16 7l5 5z"
              />
            </svg>

            Log out
          </button>
        </div>

      </div>

      {/* Admin content */}
      <div className="space-y-10 px-7 pb-10">

        {/* Categories */}
        <CategoryManager />

        {/* Products + Product Fields + Product Field Options */}
        <ProductManager />

      </div>

    </section>
  );
}