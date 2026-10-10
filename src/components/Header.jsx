"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBasket, UserRound, LogOut, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import PriceMarquee from "./PriceMarquee";

const HeaderContent = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });

    setDate(today);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories",
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Categories API error: ${res.status}`);
        }

        const result = await res.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.categories)
              ? result.categories
              : [];

        setCategories(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Category fetch error:", error);
          setCategories([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("[data-profile-menu]")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("JPG, PNG অথবা WEBP ছবি নির্বাচন করুন", {
        position: "top-center",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("ছবির সাইজ সর্বোচ্চ 2 MB হতে পারবে", {
        position: "top-center",
      });
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        toast.success("প্রোফাইল ছবির preview পরিবর্তন হয়েছে", {
          position: "top-center",
        });
      }

      setUploadingImage(false);
    };

    reader.onerror = () => {
      toast.error("ছবি পড়া যায়নি। আবার চেষ্টা করুন", {
        position: "top-center",
      });
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setProfileOpen(false);
    setLoggingOut(true);

    try {
      toast.dismiss();

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "লগআউট করা যায়নি", {
          id: "logout-error",
          position: "top-center",
        });
        setLoggingOut(false);
        return;
      }

      setAvatarPreview(null);

      toast.success("সফলভাবে লগআউট হয়েছে", {
        id: "logout-success",
        position: "top-center",
        duration: 1200,
      });

      window.setTimeout(() => {
        toast.dismiss("logout-success");
        router.replace("/sign-in");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error("Logout error:", error);
      toast.dismiss();
      toast.error("লগআউট করার সময় সমস্যা হয়েছে", {
        id: "logout-error",
        position: "top-center",
      });
      setLoggingOut(false);
    }
  };

  const avatarImage = avatarPreview || user?.image || null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-3"
          aria-label="বাজার দর হোম পেজ"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
            <ShoppingBasket size={28} strokeWidth={2} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              বাজার দর
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              {date || "বাংলা তারিখ"}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
          ) : user ? (
            <div className="relative" data-profile-menu>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-green-600 bg-green-50 text-green-700 transition hover:ring-4 hover:ring-green-100 focus:outline-none focus:ring-4 focus:ring-green-100"
                aria-label="প্রোফাইল মেনু"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 z-[60] mt-3 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                  role="menu"
                >
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-50 text-green-700">
                      {avatarImage ? (
                        <img
                          src={avatarImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={24} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user.name || "ব্যবহারকারী"}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700">
                    <Camera size={18} />
                    <span>
                      {uploadingImage
                        ? "ছবি লোড হচ্ছে..."
                        : "প্রোফাইল ছবি পরিবর্তন"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={handleImageChange}
                    />
                  </label>

                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                    role="menuitem"
                  >
                    <UserRound size={18} />
                    <span>প্রোফাইল ইনফো</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    role="menuitem"
                  >
                    <LogOut size={18} />
                    <span>{loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={`border border-green-600 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  pathname === "/sign-in"
                    ? "text-green-700 shadow-sm ring-2 ring-green-600 ring-offset-1"
                    : "text-green-600 hover:bg-green-100"
                }`}
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className={`border border-green-600 rounded-lg px-3 py-2 text-[16px] font-semibold transition sm:px-5 ${
                  pathname === "/sign-up"
                    ? "text-green-700 shadow-sm ring-2 ring-green-600 ring-offset-1"
                    : "text-green-600 hover:bg-green-100"
                }`}
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="w-full border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="flex items-center gap-3 overflow-x-auto py-3 no-scrollbar">
            <Link
              href="/home"
              aria-current={pathname === "/home" ? "page" : undefined}
              className={`group flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[20px] font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                pathname === "/home" || pathname === "/"
                  ? "border-green-600 bg-green-600 text-white shadow-sm"
                  : "border-transparent bg-gray-50 text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <span className="text-base transition-transform duration-200 group-hover:scale-110">
                🏠
              </span>
              <span>হোম</span>
            </Link>

            {!loading &&
              categories.map((item) => {
                const categoryId =
                  item.slug ?? item.categorySlug ?? item._id ?? item.id;

                const categoryName =
                  item.nameBn ??
                  item.name_bn ??
                  item.name ??
                  item.categoryName ??
                  item.title;

                const categoryIcon = item.icon ?? item.emoji;

                const categoryPath = `/category/${categoryId}`;

                const isActive =
                  pathname === categoryPath ||
                  pathname.startsWith(`${categoryPath}/`);

                return (
                  <Link
                    key={item.id ?? item._id ?? item.slug ?? categoryName}
                    href={categoryPath}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[20px] font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-green-600 bg-green-600 text-white shadow-sm"
                        : "border-transparent bg-gray-50 text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {categoryIcon && (
                      <span
                        className="text-base transition-transform duration-200 group-hover:scale-110"
                        aria-hidden="true"
                      >
                        {categoryIcon}
                      </span>
                    )}
                    <span>{categoryName}</span>
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>

      <PriceMarquee />
    </header>
  );
};

export default function Header() {
  return (
    <Suspense fallback={<div className="h-20 w-full bg-white border-b" />}>
      <HeaderContent />
    </Suspense>
  );
}