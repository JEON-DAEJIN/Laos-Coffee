export interface OrderItem {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

export type PaymentMethod = "카드결제" | "카카오페이" | "무통장입금";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  recipientName: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export type NewOrderInput = Omit<Order, "id" | "createdAt">;
