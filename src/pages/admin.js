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
      <div className="flex gap-3">
        <h2>Admin Panel</h2>
        <button>Log out</button>
      </div>
    </section>
  );
}
