import Image from "next/image"; //this line imports image itself


export default function Hero() {
    return (
        <header>
            <div class="upper-nav">
                <ul>
                     <li>
                         <Image
                src="/images/no-limit-logo.png"
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
    );
}