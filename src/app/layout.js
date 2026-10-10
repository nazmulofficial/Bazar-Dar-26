import "./globals.css";
import Header from "@/components/Header";
import Providers from "./providers";
import Footer from "@/components/Footer";
import { Noto_Serif_Bengali } from "next/font/google";

const noto_Serif_Bengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata = {
  title: "BazarDor",
  description: "বাজারের নিত্যপ্রয়োজনীয় পণ্যের দাম জানুন",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${noto_Serif_Bengali.className} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#f4f7f4]">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}