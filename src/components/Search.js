'use client';  //this tells next js this component should run on the client not only in the server side

import { useSearchParams, usePathname, useRouter } from 'next/navigation'; // pathname tells you the current path, router lets you navigate to another route and params reads quesry 

export default function SearchBar() {
  const searchParams = useSearchParams(); // returns exactly what is needed from the url
  const pathname = usePathname();
  const { replace } = useRouter();
}