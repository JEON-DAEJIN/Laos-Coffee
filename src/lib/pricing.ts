import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { products } from "@/data/products";

export interface CartRow {
  item: CartItem;
  product: Product;
}

const FREE_SHIPPING_THRESHOLD = 50000;
const FLAT_SHIPPING_FEE = 3000;

export function buildCartRows(items: CartItem[]): CartRow[] {
  return items
    .map((item) => ({
      item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter(
      (row): row is CartRow => Boolean(row.product)
    );
}

export function calcPricing(rows: CartRow[]) {
  const subtotal = rows.reduce(
    (sum, { item, product }) => sum + product.salePrice * item.quantity,
    0
  );
  const allFreeShipping = rows.every(
    ({ product }) => product.delivery === "무료배송"
  );
  // 상품별 배송비 정책이 서로 다를 수 있어, 합계 기준으로 단순화한다:
  // 전 품목 무료배송이거나 합계가 기준 금액 이상이면 무료, 아니면 정액 배송비.
  const shippingFee =
    rows.length === 0 || allFreeShipping || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FLAT_SHIPPING_FEE;

  return { subtotal, shippingFee, total: subtotal + shippingFee };
}
