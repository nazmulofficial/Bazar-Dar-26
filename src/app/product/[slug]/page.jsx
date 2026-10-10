import { Suspense } from "react";
import ProductDetails from "@/components/ProductDetails";

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </div>
      }
    >
      <ProductDetails />
    </Suspense>
  );
}