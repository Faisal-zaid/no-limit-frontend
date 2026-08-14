'use client';

import {
  useSearchParams,
  usePathname,
  useRouter
} from 'next/navigation';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="
      relative
      w-full
      max-w-md
      flex
      border-2
      border-black
      rounded-lg
      overflow-hidden
    ">

      <input
        type="text"
        placeholder="Search product..."
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
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