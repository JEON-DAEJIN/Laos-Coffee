"use client";

import { useCallback, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { User } from "@/types/user";

type Result = { ok: true } | { ok: false; message: string };

const ERROR_MESSAGES: Record<string, string> = {
  "User already registered": "이미 가입된 이메일이에요.",
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않아요.",
  "Password should be at least 6 characters": "비밀번호는 6자 이상이어야 해요.",
};

function translateError(message: string): string {
  return ERROR_MESSAGES[message] ?? message;
}

function toUser(supabaseUser: SupabaseUser | null | undefined): User | null {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: (supabaseUser.user_metadata?.name as string | undefined) ?? supabaseUser.email ?? "",
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session?.user));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<Result> => {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name: name.trim() } },
      });
      if (error) return { ok: false, message: translateError(error.message) };
      return { ok: true };
    },
    []
  );

  const logIn = useCallback(
    async (email: string, password: string): Promise<Result> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { ok: false, message: translateError(error.message) };
      return { ok: true };
    },
    []
  );

  const logOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, signUp, logIn, logOut };
}
