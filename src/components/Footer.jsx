import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-emerald-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200/60">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/home" className="hover:text-[#078b45] transition">হোম</Link>
            <Link href="/home#সব-পণ্য" className="hover:text-[#078b45] transition">সব পণ্য</Link>
            <Link href="/signin" className="hover:text-[#078b45] transition">সাইন ইন</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
          <p>
            &copy; 2026 বাজার দর. সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;