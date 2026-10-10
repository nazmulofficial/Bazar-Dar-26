import { Suspense } from "react";
import Link from "next/link";
import ProductCards from "../../product/ProductCards";

const categories = {
  chal: { name: "চাল", icon: "🍚" },
  dal: { name: "ডাল", icon: "🫘" },
  tel: { name: "তেল", icon: "🛢️" },
  sobji: { name: "সবজি", icon: "🥬" },
  mach: { name: "মাছ", icon: "🐟" },
  mangsho: { name: "মাংস", icon: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", icon: "🥛" },
  mosla: { name: "মসলা", icon: "🌶️" },
};

export default function CategoryPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            ক্যাটাগরির পণ্য লোড হচ্ছে...
          </p>
        </main>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }) {
  const { slug } = await params;

  const category = categories[slug];

  if (!category) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          ক্যাটাগরি পাওয়া যায়নি
        </h1>

        <Link
          href="/"
          className="mt-5 rounded-xl bg-[#078b45] px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#078b45]">
            হোম
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </nav>

        <ProductCards category={slug} />
      </div>
    </main>
  );
}