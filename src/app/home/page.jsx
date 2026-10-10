import React from "react";
import { ArrowRight } from "lucide-react";
import ProductCards from "../product/ProductCards";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="px-3 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-2xl sm:rounded-[24px] border border-[#e0e9e1] bg-[#f9fcf9] p-5 sm:p-8 md:flex-row md:px-10 md:py-12">
          
          <div className="w-full text-center md:text-left md:max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-[#dff3e5] px-3 py-1 text-xs font-medium text-[#078443]">
              শুক্রবার, ৯ অক্টোবর, ২০২৬
            </span>

            <h1 className="mt-3 sm:mt-4 text-xl font-extrabold leading-snug tracking-tight text-[#202923] sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 sm:mt-4 max-w-xl mx-auto md:mx-0 text-xs sm:text-base leading-6 sm:leading-7 text-[#737d76]">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, দ্রুত, সর্বনিম্ন-সর্বোচ্চ
              এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="mt-5 sm:mt-6 flex justify-center md:justify-start">
              <Link
                href="/all-products"
                className="inline-flex items-center gap-2 rounded-lg bg-[#078b45] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-green-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#06763b] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                সব পণ্য দেখুন
                <ArrowRight size={16} className="sm:w-[17px] sm:h-[17px]" />
              </Link>
            </div>
          </div>

          <div className="flex w-full items-center justify-center md:w-[36%] mt-4 md:mt-0">
            <svg
              viewBox="0 0 240 210"
              className="h-auto w-44 sm:w-56 md:w-60"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="তাজা ফল ও সবজির ঝুড়ি"
            >
              <ellipse
                cx="120"
                cy="187"
                rx="96"
                ry="11"
                fill="#e4e9e5"
              />

              <circle cx="88" cy="91" r="29" fill="#f0444e" />

              <path
                d="M87 63 Q91 48 106 43"
                fill="none"
                stroke="#159447"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <ellipse
                cx="78"
                cy="85"
                rx="7"
                ry="13"
                fill="#ff8b91"
                transform="rotate(28 78 85)"
              />

              <ellipse
                cx="143"
                cy="82"
                rx="31"
                ry="35"
                fill="#19c56b"
              />

              <path
                d="M143 49 Q139 31 124 27 M143 49 Q151 30 161 27"
                fill="none"
                stroke="#148842"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <ellipse
                cx="132"
                cy="79"
                rx="7"
                ry="11"
                fill="#83efaa"
                transform="rotate(20 132 79)"
              />

              <circle cx="65" cy="110" r="18" fill="#ad50f5" />

              <circle cx="115" cy="106" r="18" fill="#ff7817" />

              <circle cx="177" cy="109" r="20" fill="#ffae0b" />

              <path
                d="M178 89 Q179 80 190 77"
                fill="none"
                stroke="#159447"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M48 126 L205 126 L199 145 L53 145 Z"
                fill="#91400b"
              />

              <path
                d="M53 145 L199 145 L188 194 Q187 201 179 201 L73 201 Q65 201 64 194 Z"
                fill="#b9570b"
              />
            </svg>
          </div>
        </div>
      </section>

      <ProductCards />
    </main>
  );
}