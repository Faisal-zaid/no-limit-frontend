"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Productdisplay({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/product"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading products...
      </div>
    );
  }

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category_id === selectedCategory.id
      )
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No products found for{" "}
        {selectedCategory?.name || "this category"}.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl">

      <h2 className="text-xl font-bold mb-6 text-gray-800">
        {selectedCategory
          ? `${selectedCategory.name} Products`
          : "All Products"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filteredProducts.map((product) => (

          <div
            key={product.id}
            className="border border-gray-200 rounded-xl p-4
                       flex flex-col justify-between
                       hover:shadow-md transition-shadow bg-white"
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
                {product.description ||
                  "No description available."}
              </p>

              <p className="font-bold text-purple-600 mb-4">
                KSh {product.base_price}
              </p>

            </div>

            {/* Configure product */}
            <Link
              href={`/product/${product.id}`}
              className="w-full text-center bg-purple-600
                         hover:bg-purple-700 text-white
                         py-2 rounded-lg transition"
            >
              Add to Cart
            </Link>

          </div>

        ))}

      </div>
    </div>
  );
}