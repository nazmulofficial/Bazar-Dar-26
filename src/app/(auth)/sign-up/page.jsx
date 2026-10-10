"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (loading || socialLoading) return;

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email || !formData.password || !formData.confirmPassword) {
      setError("সবগুলো তথ্য পূরণ করুন।");
      return;
    }

    if (formData.password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password: formData.password,
      });

      if (error) {
        setError(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।"
        );
        setLoading(false);
        return;
      }

      if (!data) {
        setError("অ্যাকাউন্ট তৈরির ফলাফল পাওয়া যায়নি। আবার চেষ্টা করুন।");
        setLoading(false);
        return;
      }

      setSuccess("অ্যাকাউন্ট তৈরি হয়েছে।");

      router.push("/home");
      router.refresh();
    } catch (err) {
      console.error("Sign up error:", err);
      setError("সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    if (loading || socialLoading) return;

    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/home",
      });

      if (error) {
        console.error(`${provider} Sign Up Error:`, error);
        setError(
          provider === "google"
            ? "Google দিয়ে সাইন আপ করা যায়নি।"
            : "GitHub দিয়ে সাইন আপ করা যায়নি।"
        );
        setSocialLoading("");
      }
    } catch (err) {
      console.error(`${provider} Sign Up Exception:`, err);
      setError(
        provider === "google"
          ? "Google দিয়ে সাইন আপ করা যায়নি।"
          : "GitHub দিয়ে সাইন আপ করা যায়নি।"
      );
      setSocialLoading("");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed";

  const isBusy = loading || Boolean(socialLoading);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f4f7f4] px-4 py-8 pt-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isBusy}
            />
          </div>

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
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isBusy}
            />
          </div>

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
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-20`}
                minLength={8}
                required
                disabled={isBusy}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isBusy}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#078b45] hover:underline disabled:opacity-50"
              >
                {showPassword ? "লুকান" : "দেখুন"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isBusy}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full rounded-lg bg-[#078b45] py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition hover:bg-[#06763b] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            {socialLoading === "google" ? (
              <svg className="h-4 w-4 animate-spin text-gray-700" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
            {socialLoading === "google" ? "Google-এ যাচ্ছেন..." : "Google দিয়ে চালিয়ে যান"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            {socialLoading === "github" ? (
              <svg className="h-4 w-4 animate-spin text-gray-700" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 shrink-0 fill-current text-gray-900"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            {socialLoading === "github" ? "GitHub-এ যাচ্ছেন..." : "GitHub দিয়ে চালিয়ে যান"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#078b45] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/home"
          className="text-sm text-gray-400 transition hover:text-gray-600"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default Page;