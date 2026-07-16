import { supabase } from "./client";

export interface DbReview {
  id: string;
  product_id: number;
  user_id: string | null;
  author_name: string;
  rating: number;
  content: string;
  created_at: string;
}

export async function fetchReviews(productId: number): Promise<DbReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch reviews", error);
    return [];
  }
  return data ?? [];
}
