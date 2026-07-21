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
                width={700}
                height={500}
            />
                    </li>
                    <li>NAIROBI,Ke</li>
                    <li></li>
                    <li>CUSTOM BRANDING & MERCHANDISE</li>
                    
                   
                </ul>
            </div>
            <div className="lower-nav">
                <ul>
                     <li>NO LIMIT BRANDS</li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </header>
    );
}