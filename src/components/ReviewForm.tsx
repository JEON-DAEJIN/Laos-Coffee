"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase/client";

interface ReviewFormProps {
  productId: number;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <p className="mt-4 text-sm text-zinc-500">
        리뷰를 쓰려면{" "}
        <Link href="/login" className="font-medium text-amber-800 underline dark:text-amber-500">
          로그인
        </Link>
        이 필요해요.
      </p>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (content.trim().length < 5) {
      setError("리뷰 내용을 5자 이상 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      author_name: user.name,
      rating,
      content: content.trim(),
    });
    setSubmitting(false);

    if (insertError) {
      setError("리뷰 등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setContent("");
    setRating(5);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="p-1 text-lg text-amber-500"
            aria-label={`${value}점`}
          >
            {value <= rating ? "★" : <span className="text-zinc-300">★</span>}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="이 상품에 대한 리뷰를 남겨보세요."
        className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-amber-700 dark:border-zinc-700 dark:bg-zinc-950"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-xl bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-900 disabled:opacity-60"
      >
        {submitting ? "등록하는 중..." : "리뷰 등록"}
      </button>
    </form>
  );
}
