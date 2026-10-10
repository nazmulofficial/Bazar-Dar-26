"use client";

import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Providers({ children }) {
  useEffect(() => {
    const logoutSuccess = sessionStorage.getItem(
      "bazardor:logout-success"
    );

    if (logoutSuccess === "true") {
      sessionStorage.removeItem("bazardor:logout-success");

      const timer = window.setTimeout(() => {
        toast.success("সফলভাবে লগআউট হয়েছে", {
          id: "logout-success",
          duration: 3000,
        });
      }, 300);

      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: "#078b45",
              color: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}