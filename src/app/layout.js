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
      {/* Updated background to match the radial gold-to-orange gradient */}
      <body className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FCD34D] via-[#F59E0B] to-[#D97706] text-[#4C1D95] min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}