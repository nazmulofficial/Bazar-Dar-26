"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const toBanglaDigits = (value) =>
  String(value ?? "").replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

const formatBanglaNumber = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  return toBanglaDigits(value);
};

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data");
        }

        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Products fetch error:", err);
          setError("পণ্যের তথ্য লোড করা যায়নি।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f5f0]">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">সব পণ্যের তথ্য লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f0f5f0] px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          আবার চেষ্টা করুন
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f5f0]">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#078b45]">বাজারদর</p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            সব পণ্য
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            মোট {formatBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => {
              const isUp = item.change?.dir === "up";
              const isDown = item.change?.dir === "down";

              const unitName =
                item.unit === "kg"
                  ? "প্রতি কেজি"
                  : item.unit === "litre"
                    ? "প্রতি লিটার"
                    : item.unit === "dozen"
                      ? "প্রতি ডজন"
                      : "প্রতি পিস";

              return (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group flex h-full w-full flex-col justify-between rounded-2xl border border-[#dfe7df] bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                      {item.image || item.categoryIcon || "🛒"}
                    </span>

                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-gray-900 transition group-hover:text-[#078b45] sm:text-lg">
                        {item.nameBn || "নাম পাওয়া যায়নি"}
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-600">
                        {unitName}
                      </p>

                      {item.categoryNameBn && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {item.categoryNameBn}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500">আজকের দাম</p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="text-xl font-extrabold text-gray-900">
                        ৳{formatBanglaNumber(item.today)} টাকা
                      </span>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          isUp
                            ? "bg-red-50 text-red-600"
                            : isDown
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isUp ? "▲ " : isDown ? "▼ " : "— "}
                        {formatBanglaNumber(item.change?.pct ?? 0)}%
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}

        <div className="mt-8">
          <Link
            href="/home"
            className="inline-flex rounded-xl bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}