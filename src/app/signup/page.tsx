"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("이름을 2자 이상 입력해 주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식이 아니에요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 달라요.");
      return;
    }

    const result = signUp(name, email, password);
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
          회원가입
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Lao Aroma와 함께 커피 여행을 시작해 보세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              이름
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="홍길동"
              autoComplete="name"
            />
          </label>

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
              placeholder="6자 이상"
              autoComplete="new-password"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              비밀번호 확인
            </span>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
              autoComplete="new-password"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-2 rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-900"
          >
            가입하기
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-amber-800 hover:underline dark:text-amber-500">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
