"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { logIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = logIn(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          로그인
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          다시 만나서 반가워요.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              이메일
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              비밀번호
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-2 rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-900"
          >
            로그인
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-500">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-amber-800 hover:underline dark:text-amber-500">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
