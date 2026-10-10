"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const Footer = () => {
  const [year, setYear] = useState("2026");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="mt-auto border-t border-emerald-100 bg-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Main Footer */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-emerald-200/70 pb-6 md:flex-row">

          {/* Brand */}
          <div className="text-center md:text-left">
            <Link
              href="/home"
              aria-label="বাজার দর হোম পেজ"
              className="inline-block rounded-md text-lg font-bold text-gray-900 transition-colors hover:text-[#078b45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078b45]"
            >
              বাজার দর
            </Link>

            <p className="mt-1 text-sm text-gray-600">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-gray-600 sm:gap-x-7"
          >
            <Link
              href="/home"
              className="rounded-sm transition-colors hover:text-[#078b45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078b45]"
            >
              হোম
            </Link>

            <Link
              href="/home#সব-পণ্য"
              className="rounded-sm transition-colors hover:text-[#078b45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078b45]"
            >
              সব পণ্য
            </Link>

            <Link
              href="/sign-in"
              className="rounded-sm transition-colors hover:text-[#078b45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078b45]"
            >
              সাইন ইন
            </Link>
          </nav>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center text-xs leading-6 text-gray-500 sm:flex-row sm:text-left">

          <p className="max-w-2xl">
            সকল দাম সম্ভাব্য; বাজার পরিস্থিতির ওপর নির্ভর করে পরিবর্তিত হতে পারে।
          </p>

          <p className="shrink-0">
            &copy; {year} বাজার দর। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
