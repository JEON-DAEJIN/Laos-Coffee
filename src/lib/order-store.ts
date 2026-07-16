"use client";

import { useCallback, useSyncExternalStore } from "react";
import { NewOrderInput, Order } from "@/types/order";

const STORAGE_KEY = "laos-coffee-orders";
const ORDER_EVENT = "laos-coffee-orders-changed";

let cachedRaw: string | null = null;
let cachedOrders: Order[] = [];

function readOrders(): Order[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedOrders = raw ? JSON.parse(raw) : [];
    } catch {
      cachedOrders = [];
    }
  }
  return cachedOrders;
}

function writeOrders(orders: Order[]) {
  cachedOrders = orders;
  cachedRaw = JSON.stringify(orders);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  window.dispatchEvent(new Event(ORDER_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(ORDER_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(ORDER_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_ORDERS: Order[] = [];

function getServerSnapshot(): Order[] {
  return EMPTY_ORDERS;
}

export function useOrders() {
  const orders = useSyncExternalStore(subscribe, readOrders, getServerSnapshot);

  const createOrder = useCallback((input: NewOrderInput): Order => {
    const order: Order = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeOrders([...readOrders(), order]);
    return order;
  }, []);

  return { orders, createOrder };
}
