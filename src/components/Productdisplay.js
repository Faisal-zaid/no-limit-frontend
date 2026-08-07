"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Productdisplay({ onSelectCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("http://127.0.0.1:8001/product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="p-6 text-gray-500">No products found.</div>;
  }

  return (
    <div className="p-6  bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">All Categories</h2>
      
      {/* 3 columns on medium screens and up, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectCategory && onSelectCategory(product)}
            className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer bg-white"
          >
            <div>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {product.description || "No description available."}
              </p>
            </div>

            <Link
              href={`/categoriespage/${category.id}`}
              className="mt-auto text-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Products
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}