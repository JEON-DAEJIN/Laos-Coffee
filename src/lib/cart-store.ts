"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CartItem } from "@/types/cart";

const STORAGE_KEY = "laos-coffee-cart";
const CART_EVENT = "laos-coffee-cart-changed";

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = [];

function readCart(): CartItem[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = raw ? JSON.parse(raw) : [];
    } catch {
      cachedItems = [];
    }
  }
  return cachedItems;
}

function writeCart(items: CartItem[]) {
  cachedItems = items;
  cachedRaw = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  window.dispatchEvent(new Event(CART_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_CART: CartItem[] = [];

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const addItem = useCallback((productId: number, quantity: number) => {
    const current = readCart();
    const existing = current.find((item) => item.productId === productId);
    const next = existing
      ? current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...current, { productId, quantity }];
    writeCart(next);
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const current = readCart();
    const next =
      quantity <= 0
        ? current.filter((item) => item.productId !== productId)
        : current.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
    writeCart(next);
  }, []);

  const removeItem = useCallback((productId: number) => {
    writeCart(readCart().filter((item) => item.productId !== productId));
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addItem, updateQuantity, removeItem, totalCount };
}
