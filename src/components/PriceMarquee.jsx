"use client";

import React, { useEffect, useState } from "react";

const PriceMarquee = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 overflow-hidden py-3">
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {[...products, ...products].map((item, index) => {
          const isUp = item.change.dir === "up";
          const isDown = item.change.dir === "down";

          return (
            <div
              key={index}
              className="flex items-center gap-2 px-6 text-sm font-medium text-gray-700 shrink-0 border-r border-gray-200"
            >
              <span>{item.image || item.categoryIcon}</span>
              <span className="font-semibold text-gray-900">{item.nameBn}</span>
              <span className="text-gray-600">
                ৳ {item.today} / {item.unit === "kg" ? "কেজি" : item.unit === "litre" ? "লিটার" : "পিস"}
              </span>
              <span
                className={`flex items-center font-bold text-xs ${
                  isUp ? "text-red-600" : isDown ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isUp && "▲ "}
                {isDown && "▼ "}
                {item.change.pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceMarquee;