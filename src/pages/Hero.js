
import Image from "next/image";
import { rancho, londrina } from "../app/fonts";

export default function Hero() {
  return (
    <div className="px-4 sm:px-6 lg:mx-[3%]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className={rancho.className}>

        {/* TOP ROW */}
        <div className="pt-3 sm:pt-0">

          <div
            className="
              flex
              flex-row
              items-center
              justify-between
              gap-4
            "
          >

            {/* LOGO */}
            <Image
              src="/images/nolimit-logo.png"
              alt="No Limit Brands logo"
              width={77}
              height={75}
              className="
                w-[58px]
                h-auto
                sm:w-[77px]
              "
            />

            {/* LOCATION */}
            <p
              className="
                text-xs
                sm:text-sm
                font-black
                tracking-wide
              "
            >
              NAIROBI, KE
            </p>

          </div>

          {/* BRAND DESCRIPTION */}

          <div
            className="
              mt-3
              text-center
              sm:text-right
            "
          >
            <p
              className="
                text-xs
                sm:text-sm
                font-black
                tracking-wide
              "
            >
              CUSTOM BRANDING & MERCHANDISE
            </p>
          </div>

        </div>


        {/* BOTTOM NAV */}

        <div
          className="
            border-t
            border-gray-200
            mt-4
            pt-3
            sm:border-0
            sm:mt-2
            sm:pt-0
          "
        >

          <ul
            className="
              flex
              justify-center
              sm:justify-end
              items-center
              gap-5
              sm:gap-[15%]
              text-xs
              sm:text-[18px]
              list-none
              tracking-wide
            "
          >

            <li className="cursor-pointer hover:opacity-60 transition">
              COLLECTIONS
            </li>

            <li>@</li>

            <li className="cursor-pointer hover:opacity-60 transition">
              NO LIMIT BRANDS
            </li>

          </ul>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-8
          lg:gap-[2%]
          mt-8
          sm:mt-10
        "
      >

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className={`
            ${londrina.className}
            w-full
            lg:w-1/2
            flex
            flex-col
          `}
        >

          {/* HEADING */}

          <div
            className="
              mt-2
              sm:mt-6
              lg:mt-[8%]
              mb-5
            "
          >

            <h1
              className="
                text-[38px]
                leading-[1.05]
                sm:text-[52px]
                lg:text-[30px]
                font-normal
              "
            >
              NO LIMIT BRANDS
              <br />
              CRAFTED FOR
              <br />
              IMPACT
            </h1>

          </div>


          {/* DESCRIPTION */}

          <div
            className="
              text-[17px]
              sm:text-[20px]
              leading-[1.7]
              text-gray-800
              max-w-2xl
            "
          >

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

          <div
            className="
              flex
              flex-row
              gap-3
              mt-7
              sm:mt-8
              w-full
              sm:w-auto
              sm:ml-[5%]
            "
          >

            {/* VISIT SHOP */}

            <button
              className="
                bg-black
                text-white
                border
                border-black
                px-4
                sm:px-5
                py-3
                rounded-[10px]
                flex-1
                sm:flex-none
                text-sm
                sm:text-base
                hover:bg-gray-800
                transition
              "
            >
              VISIT SHOP
            </button>


            {/* CONTACT */}

            <a
              href="https://wa.me/254712345678?text=Hello%20No%20Limit%20Brands%2C%20I%27d%20like%20to%20inquire%20about%20your%20custom%20branding%20and%20merchandise%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="
                border-2
                border-black
                px-4
                sm:px-5
                py-3
                rounded-[10px]
                flex-1
                sm:flex-none
                text-center
                text-sm
                sm:text-base
                hover:bg-black
                hover:text-white
                transition
              "
            >
              CONTACT US
            </a>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE / IMAGE
        ================================================= */}

        <div
          className="
            w-full
            lg:w-1/2
            flex
            justify-center
            lg:justify-end
            mt-4
            sm:mt-8
            lg:mt-0
          "
        >

          <Image
            src="/images/latest background2.png"
            alt="No Limit Brands"
            width={570}
            height={550}
            priority
            className="
              w-full
              max-w-[380px]
              sm:max-w-[500px]
              lg:max-w-[570px]
              h-auto
              lg:w-[85%]
            "
          />

        </div>

      </section>

    </div>
  );
}

