"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatWon } from "@/lib/format";
import { buildCartRows, calcPricing } from "@/lib/pricing";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  const cartRows = buildCartRows(items);
  const { subtotal, shippingFee, total } = calcPricing(cartRows);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          장바구니
        </h1>

        {cartRows.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-zinc-500">장바구니가 비어 있습니다.</p>
            <Link
              href="/"
              className="rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="flex flex-col gap-4">
              {cartRows.map(({ item, product }) => (
                <li
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  >
                    <ProductImagePlaceholder
                      seed={product.id}
                      description={product.image}
                      className="h-full w-full"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="-my-2 shrink-0 p-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-11 w-11 items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          aria-label="수량 감소"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, item.quantity + 1)
                          }
                          className="flex h-11 w-11 items-center justify-center text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          aria-label="수량 증가"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {formatWon(product.salePrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">상품 금액</dt>
                  <dd className="text-zinc-900 dark:text-zinc-100">
                    {formatWon(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">배송비</dt>
                  <dd className="text-zinc-900 dark:text-zinc-100">
                    {shippingFee === 0 ? "무료" : formatWon(shippingFee)}
                  </dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-zinc-200 pt-3 text-base font-bold dark:border-zinc-800">
                  <dt>총 결제금액</dt>
                  <dd>{formatWon(total)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-4 block w-full rounded-xl bg-amber-800 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-amber-900"
              >
                주문하기
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
