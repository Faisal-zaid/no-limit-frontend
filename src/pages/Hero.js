import Image from "next/image";
import { rancho, londrina, impactFont } from "../app/fonts";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="px-4 sm:px-6 lg:mx-[3%] text-[#4C1D95]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className={rancho.className}>

        {/* TOP ROW */}
        <div className="pt-3 sm:pt-0">

          <div className="flex flex-row items-center justify-between gap-4">

            {/* LOGO */}
            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit Brands logo"
              width={77}
              height={75}
              className="w-[58px] h-auto sm:w-[77px]"
            />

            {/* LOCATION */}
            <p className="text-sm sm:text-base font-black tracking-wide text-[#3B0764]">
              NAIROBI, KE
            </p>

          </div>

          {/* BRAND DESCRIPTION */}

          <div className="mt-3 text-center sm:text-right">
            <p className="text-sm sm:text-base font-black tracking-wide text-[#3B0764]">
              CUSTOM BRANDING & MERCHANDISE
            </p>
          </div>

        </div>

        {/* BOTTOM NAV */}

        <div className="border-t border-[#4C1D95]/20 mt-4 pt-3 sm:border-0 sm:mt-2 sm:pt-0">

          <ul className="flex justify-center sm:justify-end items-center gap-5 sm:gap-[15%] text-sm sm:text-[20px] list-none tracking-wide font-bold text-[#3B0764]">

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
          HERO
      ===================================================== */}

      <section className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[2%] mt-8 sm:mt-10">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="w-full lg:w-1/2 flex flex-col">

          {/* HEADING */}

          <div className="mt-2 sm:mt-6 lg:mt-[8%] mb-5">

            <h1
              className={`
                ${impactFont?.className || londrina.className}
                text-[#4C1D95]
                drop-shadow-[0_2px_2px_rgba(255,255,255,0.4)]
                text-[42px]
                leading-[0.95]
                sm:text-[60px]
                lg:text-[52px]
                font-black
                uppercase
                tracking-tight
              `}
            >
              WE DON'T JUST PRINT.
              <br />
              <span className="text-[#3B0764]">WE BUILD BRAND VISIBILITY.</span>
            </h1>

          </div>


          {/* DESCRIPTION */}

          <div className="text-[17px] sm:text-[20px] leading-[1.5] text-[#3B0764] font-bold max-w-2xl uppercase">

            <p>
              YOUR CUSTOMERS SEE YOUR BRAND BEFORE THEY EXPERIENCE IT. MAKE THAT FIRST IMPRESSION COUNT. MAKE YOUR BRAND IMPOSSIBLE TO IGNORE.
            </p>

          </div>


          {/* BUTTONS / BADGE */}

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">

            {/* VISIT SHOP (Gradient Banner matching lower bar in photo) */}

            <Link
              href="/Services"
              className="
                bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#2563EB]
                text-white
                font-black
                tracking-wider
                px-6
                py-3.5
                rounded-full
                shadow-lg
                text-center
                text-sm
                sm:text-base
                hover:opacity-90
                transition
                uppercase
              "
            >
              VISIT SHOP
            </Link>

            {/* CONTACT */}

            <a
              href="https://wa.me/254712345678?text=Hello%20No%20Limit%20Brands..."
              target="_blank"
              rel="noopener noreferrer"
              className="
                border-2
                border-[#4C1D95]
                text-[#4C1D95]
                font-black
                px-6
                py-3.5
                rounded-full
                text-center
                text-sm
                sm:text-base
                hover:bg-[#4C1D95]
                hover:text-white
                transition
                uppercase
              "
            >
              CONTACT US
            </a>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE / IMAGE
        ================================================= */}

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0">

          <Image
            src="/images/latest background2.png"
            alt="No Limit Brands"
            width={570}
            height={550}
            priority
            className="w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[570px] h-auto lg:w-[85%] drop-shadow-2xl"
          />

        </div>

      </section>

    </div>
  );
}