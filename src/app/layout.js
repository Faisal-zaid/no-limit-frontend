import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";
import Providers from "./providers";
import { rancho, londrina } from "./fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "No Limit",
  description: "No Limit",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-[url('/images/nolimitbackground.png')] bg-no-repeat bg-cover min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}