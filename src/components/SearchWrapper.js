import { Suspense } from "react";
import SearchBar from "./Search";

export default function SearchWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchBar />
    </Suspense>
  );
}