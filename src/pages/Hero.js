import Image from "next/image";
import { rancho, londrina } from "../app/fonts";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-[#5801B8]">

      {/* =====================================================
          HEADER (Mobile & PC Optimized - Top Line Removed)
      ===================================================== */}

      <header className={`${rancho.className} w-full`}>

        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">

          {/* LOGO & LOCATION GROUP */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit Brands logo"
              width={77}
              height={75}
              priority
              className="w-[50px] sm:w-[68px] lg:w-[77px] h-auto object-contain"
            />

            <p className="sm:hidden text-xs font-black tracking-wide text-[#5801B8]">
              NAIROBI, KE
            </p>
          </div>

          <p className="hidden sm:block text-sm lg:text-base font-black tracking-wide text-[#5801B8]">
            NAIROBI, KE
          </p>

          {/* BRAND DESCRIPTION */}
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm lg:text-base font-black tracking-wide text-[#5801B8]">
              CUSTOM BRANDING & MERCHANDISE
            </p>
          </div>

        </div>

        {/* BOTTOM NAV (Border removed) */}
        <div className="mt-3 sm:mt-4">
          <ul className="flex justify-center sm:justify-end items-center gap-4 sm:gap-8 lg:gap-12 text-xs sm:text-base lg:text-[18px] list-none tracking-wide font-extrabold text-[#5801B8]">
            <li className="cursor-pointer hover:opacity-75 transition">
              COLLECTIONS
            </li>
            <li>@</li>
            <li className="cursor-pointer hover:opacity-75 transition">
              NO LIMIT BRANDS
            </li>
          </ul>
        </div>

      </header>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mt-6 sm:mt-10 lg:mt-12">

        {/* LEFT COLUMN: TEXT & CTA */}
        <div className={`${londrina.className} w-full lg:w-1/2 flex flex-col text-center lg:text-left items-center lg:items-start`}>

          {/* HEADLINE */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-[#5801B8] drop-shadow-[2px_3px_0px_#2D0063] text-[36px] sm:text-[54px] lg:text-[62px] leading-[0.98] font-black tracking-tight uppercase">
              NO LIMIT BRANDS
              <br />
              CRAFTED FOR
              <br />
              IMPACT
            </h1>
          </div>

          {/* DESCRIPTION */}
          <div className="text-[16px] sm:text-[19px] lg:text-[21px] leading-[1.6] text-[#5801B8] font-extrabold max-w-xl">
            <p>
              Delivering custom print and branding experiences that blend
              visual clarity with premium production. Built for brands,
              events, and businesses that aim to lead rather than follow.
              Each order is executed with extreme attention to detail —
              focusing on material durability, vibrant color output, and
              seamless design integration.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">

            <Link
              href="/Services"
              className="
                bg-[#5801B8]
                text-[#FFD000]
                border-2
                border-[#5801B8]
                px-6
                py-3
                rounded-[12px]
                text-sm
                sm:text-base
                text-center
                font-black
                shadow-[2px_3px_0px_#2D0063]
                hover:bg-[#2D0063]
                hover:text-white
                transition
                w-full
                sm:w-auto
              "
            >
              VISIT SHOP
            </Link>

            <a
              href="https://wa.me/254712345678?text=Hello%20No%20Limit%20Brands%2C%20I%27d%20like%20to%20inquire%20about%20your%20custom%20branding%20and%20merchandise%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="
                border-2
                border-[#5801B8]
                text-[#5801B8]
                bg-white/10
                backdrop-blur-sm
                px-6
                py-3
                rounded-[12px]
                text-center
                text-sm
                sm:text-base
                font-black
                shadow-[2px_3px_0px_#2D0063]
                hover:bg-[#5801B8]
                hover:text-[#FFD000]
                transition
                w-full
                sm:w-auto
              "
            >
              CONTACT US
            </a>

          </div>

        </div>

        {/* RIGHT COLUMN: HERO IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-2 sm:mt-6 lg:mt-0">
          <Image
            src="/images/latest background2.png"
            alt="No Limit Brands"
            width={570}
            height={550}
            priority
            className="w-full max-w-[320px] sm:max-w-[460px] lg:max-w-[540px] h-auto object-contain drop-shadow-2xl"
          />
        </div>

      </section>

    </div>
  );
}