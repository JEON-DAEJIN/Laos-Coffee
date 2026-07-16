"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { useOrders } from "@/lib/order-store";
import { buildCartRows, calcPricing } from "@/lib/pricing";
import { formatWon } from "@/lib/format";
import { PaymentMethod } from "@/types/order";

const PAYMENT_METHODS: PaymentMethod[] = ["카드결제", "카카오페이", "무통장입금"];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("카드결제");
  const [error, setError] = useState<string | null>(null);

  const cartRows = buildCartRows(items);
  const { subtotal, shippingFee, total } = calcPricing(cartRows);

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 py-16 text-center dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-300">
          주문하려면 먼저 로그인해 주세요.
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

  if (cartRows.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-4 py-16 text-center dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-300">
          장바구니가 비어 있어요. 상품을 먼저 담아주세요.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (recipientName.trim().length < 2) {
      setError("받는 분 이름을 입력해 주세요.");
      return;
    }
    if (!/^[0-9-]{9,}$/.test(phone.trim())) {
      setError("연락처를 올바르게 입력해 주세요. (숫자와 - 만 가능)");
      return;
    }
    if (address.trim().length < 5) {
      setError("배송지 주소를 입력해 주세요.");
      return;
    }

    const order = createOrder({
      userId: user.id,
      items: cartRows.map(({ item, product }) => ({
        productId: product.id,
        name: product.name,
        unitPrice: product.salePrice,
        quantity: item.quantity,
      })),
      subtotal,
      shippingFee,
      total,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      paymentMethod,
    });

    clearCart();
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          주문/결제
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              주문 상품 ({cartRows.length}건)
            </h2>
            <ul className="flex flex-col gap-2">
              {cartRows.map(({ item, product }) => (
                <li
                  key={product.id}
                  className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300"
                >
                  <span>
                    {product.name} × {item.quantity}
                  </span>
                  <span>{formatWon(product.salePrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 flex flex-col gap-1.5 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
              <div className="flex justify-between">
                <dt className="text-zinc-500">상품 금액</dt>
                <dd>{formatWon(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">배송비</dt>
                <dd>{shippingFee === 0 ? "무료" : formatWon(shippingFee)}</dd>
              </div>
              <div className="flex justify-between text-base font-bold">
                <dt>총 결제금액</dt>
                <dd>{formatWon(total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              배송 정보
            </h2>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  받는 분
                </span>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
                  placeholder={user.name}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  연락처
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
                  placeholder="010-1234-5678"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  배송지 주소
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
                  placeholder="주소를 입력해 주세요"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              결제 수단
            </h2>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2.5 rounded-xl border border-zinc-300 px-3 py-2.5 text-sm has-[:checked]:border-amber-700 dark:border-zinc-700"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  {method}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-400">
              실제 결제는 진행되지 않는 목업 화면이에요.
            </p>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-900"
          >
            {formatWon(total)} 결제하기
          </button>
        </form>
      </div>
    </div>
  );
}
