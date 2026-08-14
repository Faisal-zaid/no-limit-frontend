import { Suspense } from "react";
import Search from "@/components/Search";

export default function SearchWrapper() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-[42px]" />}>
      <Search />
    </Suspense>
  );
}