"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export function SiteHeader() {
  const { totalCount } = useCart();

  return (
    <header className="border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="py-3 text-base font-bold text-amber-800 dark:text-amber-500"
        >
          Lao Aroma
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-1.5 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
        >
          <span aria-hidden>🛒</span>
          장바구니
          {totalCount > 0 && (
            <span className="rounded-full bg-amber-800 px-1.5 py-0.5 text-xs font-semibold text-white">
              {totalCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
