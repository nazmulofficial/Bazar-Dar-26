import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
          <SearchX size={40} strokeWidth={1.5} />
        </div>

        <p className="text-7xl font-extrabold tracking-tight text-green-600 sm:text-8xl">
          404
        </p>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
          আপনি যে পৃষ্ঠাটি খুঁজছেন, সেটি সরানো হয়েছে অথবা ঠিকানাটি ভুল। বাজার
          দর থেকে আবার আপনার পছন্দের পৃষ্ঠায় ফিরে যান।
        </p>

        <Link
          href="/home"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-100"
        >
          <Home size={18} />
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
