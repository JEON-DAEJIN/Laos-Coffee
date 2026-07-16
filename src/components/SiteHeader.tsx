"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";

export function SiteHeader() {
  const { totalCount } = useCart();
  const { user, logOut } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="py-3 text-base font-bold text-amber-800 dark:text-amber-500"
        >
          Lao Aroma
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">
                {user.name}님
              </span>
              <button
                type="button"
                onClick={logOut}
                className="py-3 font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/login"
                className="py-3 font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="py-3 font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                회원가입
              </Link>
            </div>
          )}

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
      </div>
    </header>
  );
}
