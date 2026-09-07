"use client";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import { useState, useEffect } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  function handleSearch() {
    const term = searchTerm.trim();

    if (term) {
      router.push(
        `/productspage?q=${encodeURIComponent(term)}`
      );
    } else {
      router.push("/productspage");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div
      className="
        relative
        w-full
        max-w-md
        flex
        border-2
        border-black
        rounded-lg
        overflow-hidden
      "
    >
      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="
          w-full
          min-w-0
          px-3
          py-2
          sm:px-4
          text-sm
          sm:text-base
          text-black
          bg-white
          focus:outline-none
        "
      />

      <button
        onClick={handleSearch}
        className="
          shrink-0
          px-3
          sm:px-5
          bg-purple-600
          text-white
          border-l-2
          border-black
          hover:bg-white
          hover:text-purple-600
          cursor-pointer
          text-sm
          sm:text-base
          transition-colors
        "
      >
        Search
      </button>
    </div>
  );
}