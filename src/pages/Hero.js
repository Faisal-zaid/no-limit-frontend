import Image from "next/image";
import { rancho, londrina } from "../app/fonts";

export default function Hero() {
  return (
    <div className="ml-[3%] mr-[3%]">
      {/* HEADER */}
      <header className={rancho.className}>
        {/* Top row */}
        <div>
          <ul className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-sm font-medium font-black">
            <li>
              <Image
                src="/images/nolimit-logo.png"
                alt="No Limit Brands logo"
                width={77}
                height={75}
              />
            </li>

            <li>NAIROBI, Ke</li>

            <li className="hidden sm:block"></li>

            <li className="text-center">CUSTOM BRANDING & MERCHANDISE</li>
          </ul>
        </div>

        {/* Bottom row */}
        <div>
          <ul className="mt-4 sm:mt-2 flex justify-center sm:justify-end gap-6 sm:gap-[15%] text-[15px] sm:text-[18px] list-none">
            <li>COLLECTIONS</li>
            <li>@</li>
            <li>NO LIMIT BRANDS</li>
          </ul>
        </div>
      </header>

      {/* HERO CONTENT */}
      <section className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[2%]">
        {/* LEFT SIDE */}
        <div className={`${londrina.className} w-full lg:w-1/2 flex flex-col`}>
          {/* Heading */}
          <div className="text-[30px] sm:text-[40px] lg:text-[30px] mb-[1%] mt-10 lg:mt-[8%]">
            <h2>
              NO LIMIT BRANDS <br />
              CRAFTED FOR <br />
              IMPACT
            </h2>
          </div>

          {/* Paragraph */}
          <div className="text-[18px] sm:text-[20px] leading-relaxed">
            <p>
              Delivering custom print and branding experiences that blend visual
              clarity with premium production. Built for brands, events, and
              businesses that aim to lead rather than follow. Each order is
              executed with extreme attention to detail— focusing on material
              durability, vibrant color output, and seamless design integration.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 ml-0 sm:ml-[5%]">
            <button
              className="
                bg-black
                text-white
                border
                px-5
                py-2
                rounded-[10px]
                w-full
                sm:w-auto
              "
            >
              VISIT SHOP
            </button>

            <a
              href="https://wa.me/254712345678?text=Hello%20No%20Limit%20Brands%2C%20I%27d%20like%20to%20inquire%20about%20your%20custom%20branding%20and%20merchandise%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="
    border
    border-2
    border-black
    px-5
    py-2
    rounded-[10px]
    w-full
    sm:w-auto
    text-center
    hover:bg-black
    hover:text-white
    transition
  "
            >
              CONTACT US
            </a>
          </div>
        </div>

        {/* RIGHT SIDE / IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
          <Image
            src="/images/latest background2.png"
            alt="No Limit Brands"
            width={570}
            height={550}
            className="
              w-full
              max-w-[570px]
              h-auto
              lg:w-[85%]
            "
          />
        </div>
      </section>
    </div>
  );
}
