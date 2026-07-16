-- Lao Aroma: reviews table + RLS policies + seed data
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null,
  user_id uuid references auth.users(id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Users can insert their own reviews"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Seed data carried over from the old mock reviews (user_id left null since
-- these weren't written by real accounts; RLS only gates inserts through the
-- app, not these direct seed inserts).
insert into public.reviews (product_id, author_name, rating, content, created_at) values
  (1, 'luang_traveler', 5, '루앙프라방에서 매일 아침 마시던 그 향이 그대로 느껴져요. 여행 다시 가고 싶어지는 커피입니다.', '2026-05-02T09:00:00Z'),
  (1, 'coffee_and_road', 5, '산미와 바디감의 밸런스가 좋아요. 선물용으로 재구매했습니다.', '2026-04-18T09:00:00Z'),
  (2, 'night_owl', 4, '다크로스트치고 쓴맛이 과하지 않아서 좋았어요.', '2026-05-10T09:00:00Z'),
  (2, 'bolaven_fan', 5, '볼라벤 고원 여행 때 마셨던 맛이랑 거의 똑같아서 놀랐어요.', '2026-03-22T09:00:00Z'),
  (3, 'backpack_kim', 5, '드립백이라 회사에서도 간편하게 즐기고 있어요.', '2026-05-20T09:00:00Z'),
  (3, 'pakse_memory', 4, '향은 정말 좋은데 양이 조금 아쉬워요.', '2026-04-05T09:00:00Z'),
  (4, 'decaf_lover', 4, '디카페인인데도 향이 진해서 만족스럽습니다.', '2026-05-14T09:00:00Z'),
  (5, 'office_worker_j', 4, '믹스인데 은근 고급스러운 맛이에요. 회사 탕비실용으로 딱입니다.', '2026-05-01T09:00:00Z'),
  (5, 'champasak_traveler', 5, '참파삭 폭포 여행 생각나서 자꾸 손이 가요.', '2026-03-30T09:00:00Z'),
  (7, 'vangvieng_hiker', 4, '산미가 산뜻해서 아침에 마시기 좋아요.', '2026-05-08T09:00:00Z'),
  (8, 'gift_giver', 5, '부모님 선물로 드렸는데 반응이 아주 좋았어요.', '2026-05-16T09:00:00Z'),
  (8, 'blue_lagoon', 5, '패키지 디자인도 예쁘고 맛도 좋아서 두 박스 더 주문했어요.', '2026-04-27T09:00:00Z');
