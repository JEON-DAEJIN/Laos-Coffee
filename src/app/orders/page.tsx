"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-store";
import { useOrders } from "@/lib/order-store";
import { formatWon } from "@/lib/format";

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 py-16 text-center dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-300">
          주문 내역을 보려면 먼저 로그인해 주세요.
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  const myOrders = orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          주문 내역
        </h1>

        {myOrders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-zinc-500">아직 주문 내역이 없어요.</p>
            <Link
              href="/"
              className="rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {myOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="block rounded-2xl border border-zinc-200 p-4 hover:border-amber-700 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      주문번호 {order.id.slice(0, 8)}
                    </span>
                    <span className="text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {order.items[0]?.name}
                    {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                  </p>
                  <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {formatWon(order.total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
