"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrders } from "@/lib/order-store";
import { formatWon } from "@/lib/format";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 py-16 text-center dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-300">
          주문 내역을 찾을 수 없어요.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
        >
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            주문이 완료되었습니다
          </p>
          <h1 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            주문번호 {order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {new Date(order.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            주문 상품
          </h2>
          <ul className="flex flex-col gap-2">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatWon(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-1.5 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
            <div className="flex justify-between">
              <dt className="text-zinc-500">상품 금액</dt>
              <dd>{formatWon(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">배송비</dt>
              <dd>{order.shippingFee === 0 ? "무료" : formatWon(order.shippingFee)}</dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>총 결제금액</dt>
              <dd>{formatWon(order.total)}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
          <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
            배송 정보
          </h2>
          <dl className="flex flex-col gap-1.5 text-zinc-600 dark:text-zinc-300">
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-zinc-400">받는 분</dt>
              <dd>{order.recipientName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-zinc-400">연락처</dt>
              <dd>{order.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-zinc-400">주소</dt>
              <dd>{order.address}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-zinc-400">결제 수단</dt>
              <dd>{order.paymentMethod}</dd>
            </div>
          </dl>
        </section>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/orders"
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
