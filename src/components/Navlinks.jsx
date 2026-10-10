import Link from "next/link";

const Navlinks = async () => {
  const res = await fetch(
    "",
    {
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  return (
    <nav className="sticky top-0 z-50 mx-auto w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <div className="flex gap-3 overflow-x-auto">
          {data.map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-green-600 hover:bg-green-50"
            >
              <span>{item.icon}</span>{" "}
              <span>{item.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navlinks;