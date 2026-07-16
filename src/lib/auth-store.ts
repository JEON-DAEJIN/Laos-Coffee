"use client";

import { useCallback, useSyncExternalStore } from "react";
import { StoredAccount, User } from "@/types/user";

const ACCOUNTS_KEY = "laos-coffee-accounts";
const SESSION_KEY = "laos-coffee-session";
const AUTH_EVENT = "laos-coffee-auth-changed";

type Result = { ok: true } | { ok: false; message: string };

let cachedSessionRaw: string | null = null;
let cachedUser: User | null = null;

function readAccounts(): StoredAccount[] {
  const raw = window.localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function readSession(): User | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw !== cachedSessionRaw) {
    cachedSessionRaw = raw;
    try {
      cachedUser = raw ? JSON.parse(raw) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function writeSession(user: User | null) {
  cachedUser = user;
  cachedSessionRaw = user ? JSON.stringify(user) : null;
  if (user) {
    window.localStorage.setItem(SESSION_KEY, cachedSessionRaw as string);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): User | null {
  return null;
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, readSession, getServerSnapshot);

  const signUp = useCallback(
    (name: string, email: string, password: string): Result => {
      const accounts = readAccounts();
      const normalizedEmail = email.trim().toLowerCase();
      if (accounts.some((a) => a.email === normalizedEmail)) {
        return { ok: false, message: "이미 가입된 이메일이에요." };
      }
      const account: StoredAccount = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      };
      writeAccounts([...accounts, account]);
      writeSession({ id: account.id, name: account.name, email: account.email });
      return { ok: true };
    },
    []
  );

  const logIn = useCallback((email: string, password: string): Result => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = readAccounts().find(
      (a) => a.email === normalizedEmail && a.password === password
    );
    if (!account) {
      return { ok: false, message: "이메일 또는 비밀번호가 올바르지 않아요." };
    }
    writeSession({ id: account.id, name: account.name, email: account.email });
    return { ok: true };
  }, []);

  const logOut = useCallback(() => {
    writeSession(null);
  }, []);

  return { user, signUp, logIn, logOut };
}
