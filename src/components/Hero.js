import Image from "next/image"; //this line imports image itself


export default function Hero() {
    return (
        <div className="bg-white text-black">
        <header>
            <div >
                <ul className="flex justify-between items-center text-sm font-medium">
                     <li>
                         <Image
                src="/images/nolimit-logo.png"
                alt="Hero Image"
                width={77}
                height={75}
            />
                    </li>
                    <li>NAIROBI,Ke</li>
                    <li></li>
                    <li>CUSTOM BRANDING & MERCHANDISE</li>
                    
                   
                </ul>
            </div>
           
            <div >
                <ul className="ml-[40%] flex flex-row list-none gap-[35%] text-[18px]">
                     <li>COLLECTIONS</li>
                    <li>@</li>
                    <li>NO LIMIT BRANDS</li>
                </ul>
            </div>
        </header>

        // the body part of the hero section
        <body>
           <div className="words">

           </div>
           <div className="image">
            
           </div>
        </body>
        </div>
    );
}