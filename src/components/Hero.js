import Image from "next/image"; //this line imports image itself
import { rancho } from "../app/layout"; // or from "@/app/fonts"
import { londrina } from "../app/layout"; // or from "@/app/fonts"

export default function Hero() {
  return (
    <div className="bg-white text-black ml-[3%] mr-[3%]">
      <header className={rancho.className}>
        <div>
          <ul className="flex justify-between items-center text-sm font-medium font-black">
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

        <div>
          <ul className="ml-[40%] flex flex-row list-none gap-[35%] text-[18px]">
            <li>COLLECTIONS</li>
            <li>@</li>
            <li>NO LIMIT BRANDS</li>
          </ul>
        </div>
      </header>

      {/* part of the paragraph hero section */}
      <section className="flex justify-between gap-[2%] ">
        <div className={`${londrina.className} w-1/2 flex flex-col gap-[5%]`}>
          <div className="text-[30px] mb-[1%] mt-[8%]">
            <h2>
              NO LIMIT BRANDS <br /> CRAFTED FOR <br /> IMPACT{" "}
            </h2>
          </div>
          <div className="text-[20px]">
            <p>
              Transforming ideas into premium tangible assets. From custom
              apparel <br />
              and magic mugs to high-grade vinyl stickers and event banners, we
              engineer
              <br />
              print and branding solutions for businesses that refuse to blend
              in. Every <br />
              piece is crafted with high-precision finish, vibrant color
              accuracy, and 
              <br />
              durable quality built to elevate your brand presence.
            </p>
          </div>
          {/* div for buttons */}
          <div className="flex gap-[1%] ml-[5%]">
                <button class="bg-black text-white border pr-[1%] pl-[1%] rounded-[10] ">VIEW PROJECTS</button>
                <button class="border border-2 border-black-500 pr-[1%] pl-[1%] rounded-[10]">CONTACT ME</button>
            </div>
        </div>
        <div className="w-1/2">
          <Image
            src="/images/nolimit-hero.png"
            alt="Hero Image"
            width={570}
            height={550}
            className="w-[85%] h-[95%]" // this code resizes the hero section image
          />
        </div>
      </section>
    </div>
  );
}
