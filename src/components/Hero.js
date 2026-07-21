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
           
            <div className="lower-nav">
                <ul>
                     <li>COLLECTIONS</li>
                    <li>@</li>
                    <li>NO LIMIT BRANDS</li>
                </ul>
            </div>
        </header>
        </div>
    );
}