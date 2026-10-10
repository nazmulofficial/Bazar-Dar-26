"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const toBanglaDigits = (value) =>
  String(value ?? "—").replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

const categories = [
  { id: "all", name: "সব", icon: "" },
  { id: "chal", name: "চাল", icon: "🍚" },
  { id: "dal", name: "ডাল", icon: "🫘" },
  { id: "tel", name: "তেল", icon: "🛢️" },
  { id: "sobji", name: "সবজি", icon: "🥬" },
  { id: "mach", name: "মাছ", icon: "🐟" },
  { id: "mangsho", name: "মাংস", icon: "🍗" },
  { id: "dim-dui", name: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", name: "মসলা", icon: "🌶️" },
];

const ProductCards = ({ category = null, showAllOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data");
        }

        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Product fetch error:", err);
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
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
      <div className="flex min-h-60 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#078b45]" />
          <p className="text-lg font-medium text-gray-500">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  const filteredProducts = category
    ? products.filter((item) => item.category === category)
    : selectedCategory === "all"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const riserProducts = products
    .filter((item) => item.change?.dir === "up")
    .slice(0, 6);

  const fallerProducts = products
    .filter((item) => item.change?.dir === "down")
    .slice(0, 6);

  const renderCard = (item) => {
    const isUp = item.change?.dir === "up";
    const isDown = item.change?.dir === "down";
    const changePercent = item.change?.pct ?? 0;

    const unitName =
      item.unit === "kg"
        ? "প্রতি কেজি"
        : item.unit === "litre"
          ? "প্রতি লিটার"
          : item.unit === "dozen"
            ? "প্রতি ডজন"
            : "প্রতি পিস";

    const displayIcon = item.image || item.categoryIcon || "🛒";

    return (
      <Link
        key={item.id}
        href={`/product/${item.id}`}
        className="group flex h-full min-h-[140px] w-full flex-col justify-between rounded-[18px] border border-[#dfe7df] bg-white/75 p-4 transition duration-200 hover:border-green-300 hover:bg-white sm:p-4 shadow-xs"
      >
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#f0f5f0] text-2xl">
              {displayIcon}
            </span>

            <div className="min-w-0">
              <h3 className="text-base font-bold leading-5 text-[#202a22] transition group-hover:text-[#078b45]">
                {item.nameBn}
              </h3>
              <p className="mt-0.5 text-xs text-[#606a62]">{unitName}</p>
            </div>
          </div>

          <div className="mt-2">
            <p className="mb-0.5 text-xs text-[#606a62]">আজকের দাম</p>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xl font-extrabold leading-6 text-[#202a22]">
                {toBanglaDigits(item.today)} টাকা
              </span>

              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                  isUp
                    ? "bg-red-50 text-red-600"
                    : isDown
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {isUp ? "▲ " : isDown ? "▼ " : "— "}
                {toBanglaDigits(changePercent)}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (showAllOnly) {
    return (
      <section className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#078b45]">বাজারদর</p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            সব পণ্য
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            মোট {products.length}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {products.map(renderCard)}
          </div>
        ) : (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    );
  }

  if (category) {
    const categoryInfo = categories.find((item) => item.id === category);

    return (
      <section className="w-full px-3 sm:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {categoryInfo?.icon} {categoryInfo?.name || "পণ্য"} এর বাজারদর
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            মোট {filteredProducts.length}টি পণ্য পাওয়া গেছে
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map(renderCard)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
            <span className="text-4xl">🛒</span>
            <p className="mt-4 font-semibold text-gray-700">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 bg-[#f1f6f1] px-3 sm:px-6 lg:px-8 py-7">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center text-sm text-red-600">
            ▲
          </span>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#202a22]">
              আজ দাম বেড়েছে
            </h2>
          </div>
        </div>

        {riserProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {riserProducts.map(renderCard)}
          </div>
        ) : (
          <p className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
            দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center text-sm text-green-600">
            ▼
          </span>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#202a22]">
              আজ দাম কমেছে
            </h2>
          </div>
        </div>

        {fallerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {fallerProducts.map(renderCard)}
          </div>
        ) : (
          <p className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
            দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section id="সব-পণ্য" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
          <p className="mt-2 text-sm text-gray-500">
            মোট {filteredProducts.length}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map(renderCard)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-12 text-center bg-white">
            <span className="text-4xl">🛒</span>
            <p className="mt-4 font-semibold text-gray-700">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="mt-4 rounded-xl bg-[#078b45] px-5 py-2.5 font-semibold text-white transition hover:bg-green-700"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductCards;