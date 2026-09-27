import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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
      <body className="bg-[radial-gradient(circle_at_50%_30%,_#FFAE00_0%,_#E87900_100%)] min-h-full flex flex-col text-[#5801B8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}