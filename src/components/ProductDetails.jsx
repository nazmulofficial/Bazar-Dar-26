"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const BANGLA_LABELS = {
  Dhaka: "ঢাকা",
  Chattogram: "চট্টগ্রাম",
  Chittagong: "চট্টগ্রাম",
  Rajshahi: "রাজশাহী",
  Khulna: "খুলনা",
  Barishal: "বরিশাল",
  Barisal: "বরিশাল",
  Sylhet: "সিলেট",
  Rangpur: "রংপুর",
  Mymensingh: "ময়মনসিংহ",
  "Dhaka Division": "ঢাকা বিভাগ",
  "Chattogram Division": "চট্টগ্রাম বিভাগ",
  "Chittagong Division": "চট্টগ্রাম বিভাগ",
  "Rajshahi Division": "রাজশাহী বিভাগ",
  "Khulna Division": "খুলনা বিভাগ",
  "Barishal Division": "বরিশাল বিভাগ",
  "Sylhet Division": "সিলেট বিভাগ",
  "Rangpur Division": "রংপুর বিভাগ",
  "Mymensingh Division": "ময়মনসিংহ বিভাগ",
  kg: "কেজি",
  kilogram: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pieces: "পিস",
  pcs: "পিস",
};

const toBanglaLabel = (value, fallback = "—") => {
  if (value == null || value === "") return fallback;
  const text = String(value).trim();
  return BANGLA_LABELS[text] || BANGLA_LABELS[text.toLowerCase()] || text;
};

const toBanglaDigits = (value) =>
  value == null || value === "" ? "—" : String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

const formatTaka = (value) =>
  value == null || value === "" ? "—" : `৳${toBanglaDigits(value)}`;

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id || params?.slug;

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      const currentPath = window.location.pathname;
      router.replace(`/sign-in?callbackURL=${encodeURIComponent(currentPath)}`);
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (isPending || !user || !productId) return;

    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/${encodeURIComponent(productId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Product fetch failed: ${response.status}`);
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setProduct(data);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Product details error:", err);
          setError("পণ্যের তথ্য লোড করা যায়নি।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [isPending, user, productId]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">অ্যাকাউন্ট যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">পণ্যের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          পণ্যটি পাওয়া যায়নি
        </h1>
        <p className="mt-3 text-gray-500">
          {error || "এই পণ্যের তথ্য পাওয়া যায়নি।"}
        </p>
        <Link
          href="/home"
          className="mt-5 rounded-xl bg-[#078b45] px-6 py-3 font-semibold text-white"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const {
    nameBn,
    name,
    categoryNameBn,
    categoryName,
    categoryIcon,
    image,
    unit,
    today,
    yesterday,
    lastWeek,
    lastMonth,
    change,
    markets = [],
  } = product;

  const productName = nameBn || name || "পণ্যের নাম পাওয়া যায়নি";
  const productCategory = toBanglaLabel(categoryNameBn || categoryName, "পণ্য");
  const unitName = toBanglaLabel(unit, "পিস");

  const isUp = change?.dir === "up";
  const isDown = change?.dir === "down";

  const validMarkets = markets.filter(
    (market) =>
      Number.isFinite(Number(market.min)) &&
      Number.isFinite(Number(market.max))
  );

  const averagePrice =
    validMarkets.length > 0
      ? Math.round(
          validMarkets.reduce(
            (sum, market) =>
              sum +
              (Number(market.min) + Number(market.max)) / 2,
            0
          ) / validMarkets.length
        )
      : null;

  const lowestPrice =
    validMarkets.length > 0
      ? Math.min(...validMarkets.map((market) => Number(market.min)))
      : null;

  const highestPrice =
    validMarkets.length > 0
      ? Math.max(...validMarkets.map((market) => Number(market.max)))
      : null;

  return (
    <main className="min-h-screen bg-[#f1f6f2]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/home" className="hover:text-[#078b45]">
            হোম
          </Link>
          <span>›</span>
          <span>{productCategory}</span>
          <span>›</span>
          <span className="font-semibold text-gray-900">{productName}</span>
        </nav>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-4xl">
                {image || categoryIcon || "🛒"}
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {categoryIcon} {productCategory}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  {productName}
                </h1>
                <p className="mt-1 text-sm text-gray-500">প্রতি {unitName}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f1f6f2] p-5 text-center sm:min-w-40">
              <p className="text-sm text-gray-500">আজকের দাম</p>
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {formatTaka(today)}
              </p>
              <p className="text-xs text-gray-500">প্রতি {unitName}</p>
              <p
                className={`mt-2 text-sm font-bold ${
                  isUp
                    ? "text-red-600"
                    : isDown
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {isUp ? "▲ " : isDown ? "▼ " : "— "}
                {toBanglaDigits(change?.pct ?? 0)}%
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard title="গতকালের দাম" price={yesterday} />
            <SummaryCard title="গত সপ্তাহের দাম" price={lastWeek} />
            <SummaryCard title="গত মাসের দাম" price={lastMonth} />
          </div>

          {averagePrice !== null && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard title="গড় বাজারদর" price={averagePrice} />
              <SummaryCard title="সর্বনিম্ন দাম" price={lowestPrice} />
              <SummaryCard title="সর্বোচ্চ দাম" price={highestPrice} />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                বাজারভিত্তিক আজকের দাম
              </h2>
              <p className="mt-1 text-sm text-gray-500">বিভিন্ন বাজারের দামের তুলনা</p>
            </div>
            <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-[#078b45]">
              {toBanglaDigits(markets.length)}টি বাজার
            </span>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-[#f7faf7]">
                  <tr>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-600">বাজার</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-600">বিভাগ</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-600">সর্বনিম্ন</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-600">সর্বোচ্চ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {markets.map((market, index) => (
                    <tr
                      key={`${toBanglaLabel(market.market, "বাজারের নাম নেই")}-${index}`}
                      className="transition hover:bg-green-50"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">
                        {toBanglaLabel(market.market, "বাজারের নাম নেই")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {toBanglaLabel(market.division, "বিভাগ উল্লেখ নেই")}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-green-700">
                        {formatTaka(market.min)}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-red-600">
                        {formatTaka(market.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              এই পণ্যের বাজারদর পাওয়া যায়নি।
            </p>
          )}
        </section>

        <div>
          <Link
            href="/all-products"
            className="inline-flex rounded-xl bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            ← সব পণ্যে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ title, price }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-5">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#078b45]">
        {formatTaka(price)}
      </p>
      <p className="mt-1 text-xs text-gray-500">প্রতি ইউনিটের দাম</p>
    </div>
  );
}