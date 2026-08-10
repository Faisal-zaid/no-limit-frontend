"use client";

import { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "@/lib/api";
import CategoryManager from "@/admin/categorymanager";
import ProductManager from "@/admin/productmanager";
import ProductFieldManager from "@/admin/productfieldmanager";
import ProductFieldOptionManager from "@/admin/productfieldoptionmanager";


export default function Admin() {
  
  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">
      <div className="flex justify-between ml-7 mr-7">
        <div></div>
        <div><h2 className="text-[30px]">Admin Panel</h2></div>
        <div><button>Log out</button></div>
      </div>
      <div className="space-y-10">

                <CategoryManager />

                <ProductManager />

                <ProductFieldManager />

                <ProductFieldOptionManager />

            </div>
    </section>
  );
}
