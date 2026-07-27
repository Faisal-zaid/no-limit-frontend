'use client';  //this tells next js this component should run on the client not only in the server side

import { useSearchParams, usePathname, useRouter } from 'next/navigation'; // pathname tells you the current path, router lets you navigate to another route and params reads quesry 

export default function SearchBar() {
  const searchParams = useSearchParams(); // returns exactly what is needed from the url
  const pathname = usePathname(); // gets the current path you are on. e.g maybe you are on products it will let you know that
  const { replace } = useRouter(); // suppose initial link was '/products' now after replace it can be '/products?search=laptop'
  
  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term); // this part is like adding a new line below an existing one so it updates the category and add product
    } else {
      params.delete('q');
    }
    // Updates the URL without reloading the page (e.g., /shop?q=shirts)
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="relative w-full max-w-md flex border border-2 border-black-500 rounded-lg">
      <input
        type="text"
        placeholder="Search product..."
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2 text-black bg-white border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
      />
      {/* the button is basically useless here its just for aesthetics */}
      <button className='pr-[2%] pl-[2%] border-l border-l-2 border-black hover:bg-[white] hover:text-[purple] cursor-pointer'>Search</button>
    </div>
  );
}