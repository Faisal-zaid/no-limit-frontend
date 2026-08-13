"use client";

import { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "@/lib/api";
import CategoryManager from "@/admin/categorymanager";
import ProductManager from "@/admin/productmanager";
import ProductFieldManager from "@/admin/productfieldmanager";
import ProductFieldOptionManager from "@/admin/productfieldoptionmanager";


export default function Admin() {

  function handleLogout(){
    // when implementing authentication
    //localstorage.removeItem("token");
    //router.push("/admin-login");

    console.log("Admin logged out")
  }
  
  return (
    <section className="min-h-screen bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover">
      <div className="flex justify-between ml-7 mr-7">
        <div></div>
        <div><h2 className="text-[30px]">Admin Panel</h2></div>
        <div><button onClick={handleLogout} className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
</svg>
Log out</button></div>
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
