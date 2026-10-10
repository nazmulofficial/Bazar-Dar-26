"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const SignInForm = () => {
  const searchParams = useSearchParams();

  // Redirect URL নিরাপদভাবে যাচাই
  const rawCallback = searchParams.get("callbackURL") || "/home";

  const callbackURL =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Back button দিয়ে Sign In পেজে ফিরলে Loading State Reset
  useEffect(() => {
    const resetLoading = () => {
      setSocialLoading("");
      setLoading(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetLoading();
      }
    };

    window.addEventListener("pageshow", resetLoading);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener("pageshow", resetLoading);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // Email এবং Password দিয়ে Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (loading || socialLoading) return;

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Email Sign In Error:", error);

        toast.error(
          error.message || "ইমেইল অথবা পাসওয়ার্ড ভুল।"
        );

        setLoading(false);
        return;
      }

      if (!data) {
        toast.error(
          "সাইন ইন নিশ্চিত করা যায়নি। আবার চেষ্টা করুন।"
        );

        setLoading(false);
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");

      window.setTimeout(() => {
        window.location.replace(callbackURL);
      }, 500);
    } catch (err) {
      console.error("Email Sign In Exception:", err);

      toast.error(
        "সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  };

  // Google এবং GitHub Sign In
  const handleSocialSignIn = async (provider) => {
    if (loading || socialLoading) return;

    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (error) {
        console.error(
          `${provider} Sign In Error:`,
          error
        );

        toast.error(
          error.message ||
            (provider === "google"
              ? "Google দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"
              : "GitHub দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।")
        );

        setSocialLoading("");
      }
    } catch (err) {
      console.error(
        `${provider} Sign In Exception:`,
        err
      );

      toast.error(
        provider === "google"
          ? "Google দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"
          : "GitHub দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"
      );

      setSocialLoading("");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-50";

  const isBusy = loading || Boolean(socialLoading);

  return (
    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Email Sign In Form */}
      <form className="space-y-4" onSubmit={handleSignIn}>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            ইমেইল
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
            disabled={isBusy}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            পাসওয়ার্ড
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-20`}
              required
              disabled={isBusy}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              disabled={isBusy}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#078b45] hover:underline disabled:opacity-50"
            >
              {showPassword ? "লুকান" : "দেখুন"}
            </button>
          </div>
        </div>

        {/* Email Sign In Button */}
        <button
          type="submit"
          disabled={isBusy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#078b45] py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition hover:bg-[#06763b] disabled:cursor-not-allowed disabled:opacity-80"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>

              সাইন ইন হচ্ছে...
            </>
          ) : (
            "সাইন ইন"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 font-medium text-gray-500">
            অথবা
          </span>
        </div>
      </div>

      {/* Social Sign In Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialSignIn("google")}
          disabled={isBusy}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {socialLoading === "google" ? (
            <svg
              className="h-4 w-4 animate-spin text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />

              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.2v3.15C3.17 21.32 7.22 24 12 24z"
              />

              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.2C.44 8.12 0 9.87 0 12s.44 3.88 1.2 5.42l4.08-3.15z"
              />

              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.68 1.2 6.58l4.08 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}

          {socialLoading === "google"
            ? "Google-এ যাচ্ছেন..."
            : "Google দিয়ে সাইন ইন"}
        </button>

        {/* GitHub */}
        <button
          type="button"
          onClick={() => handleSocialSignIn("github")}
          disabled={isBusy}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {socialLoading === "github" ? (
            <svg
              className="h-4 w-4 animate-spin text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 shrink-0 fill-current text-gray-900 sm:h-5 sm:w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          )}

          {socialLoading === "github"
            ? "GitHub-এ যাচ্ছেন..."
            : "GitHub দিয়ে সাইন ইন"}
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        অ্যাকাউন্ট নেই?{" "}

        <Link
          href="/sign-up"
          className="font-semibold text-[#078b45] hover:underline"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f4f7f4] px-4 py-8 pt-15">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          className: "font-sans",
          style: {
            maxWidth: "calc(100vw - 32px)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            zIndex: 99999,
          },
          success: {
            iconTheme: {
              primary: "#078b45",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          সাইন ইন
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-10 text-sm text-gray-500">
            লোড হচ্ছে...
          </div>
        }
      >
        <SignInForm />
      </Suspense>

      <div className="mt-6">
        <Link
          href="/home"
          className="text-sm text-gray-400 transition hover:text-gray-600"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}