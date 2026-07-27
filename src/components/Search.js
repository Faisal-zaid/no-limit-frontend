'use client';  //this tells next js this component should run on the client not only in the server side

import { useSearchParams, usePathname, useRouter } from 'next/navigation'; // pathname tells you the current path, router lets you navigate to another route and params reads quesry 

export default function SearchBar() {
  const searchParams = useSearchParams(); // returns exactly what is needed from the url
  const pathname = usePathname(); // gets the current path you are on. e.g maybe you are on products it will let you know that
  const { replace } = useRouter(); // suppose initial link was '/products' now after replace it can be '/products?search=laptop'
}