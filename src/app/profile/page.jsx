"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Mail,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4">
        <p className="text-sm sm:text-base text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl w-full">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-green-600 px-5 py-6 sm:px-8 sm:py-8 text-white">
            <div className="mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
              <UserRound size={28} className="sm:w-8 sm:h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold break-words">
              {user.name || "ব্যবহারকারী"}
            </h1>

            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-50">
              আপনার অ্যাকাউন্টের তথ্য
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5 p-4 sm:p-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              প্রোফাইল ইনফরমেশন
            </h2>

            <div className="flex items-start gap-3 sm:gap-4 rounded-xl border border-gray-100 p-3.5 sm:p-4">
              <UserRound
                className="mt-0.5 sm:mt-1 shrink-0 text-green-600"
                size={20}
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">সম্পূর্ণ নাম</p>
                <p className="mt-0.5 sm:mt-1 break-words text-sm sm:text-base font-medium text-gray-900">
                  {user.name || "তথ্য নেই"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 rounded-xl border border-gray-100 p-3.5 sm:p-4">
              <Mail
                className="mt-0.5 sm:mt-1 shrink-0 text-green-600"
                size={20}
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">ইমেইল ঠিকানা</p>
                <p className="mt-0.5 sm:mt-1 break-all text-sm sm:text-base font-medium text-gray-900">
                  {user.email || "তথ্য নেই"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 rounded-xl border border-gray-100 p-3.5 sm:p-4">
              <ShieldCheck
                className="mt-0.5 sm:mt-1 shrink-0 text-green-600"
                size={20}
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">
                  ইমেইল ভেরিফিকেশন
                </p>
                <p className="mt-0.5 sm:mt-1 text-sm sm:text-base font-medium text-gray-900">
                  {user.emailVerified
                    ? "ভেরিফাইড"
                    : "ভেরিফাই করা হয়নি"}
                </p>
              </div>
            </div>

            {user.id && (
              <div className="rounded-xl border border-gray-100 p-3.5 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500">ইউজার আইডি</p>
                <p className="mt-0.5 sm:mt-1 break-all text-xs sm:text-sm font-medium text-gray-900">
                  {user.id}
                </p>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/home"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-green-700 shadow-sm"
              >
                <ArrowLeft size={16} />
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}