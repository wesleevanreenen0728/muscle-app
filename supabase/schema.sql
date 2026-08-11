-- ============================================================================
-- Muscle Gain App — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.
-- ============================================================================

-- 1. PROFILE / SETTINGS ------------------------------------------------------
-- One row per user. Holds everything editable in the Settings screen.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age integer default 43,
  sex text default 'male',
  height_cm numeric default 180,
  starting_weight_kg numeric default 86,
  target_weight_kg numeric default 92,
  target_date date default '2026-12-31',
  activity_level text default 'low', -- low | moderate | active
  weekly_gain_target_kg numeric default 0.25, -- conservative default
  calorie_target integer default 2950,
  protein_target_g integer default 160,
  fat_target_g integer default 80,
  fibre_target_g integer default 30,
  water_target_ml integer default 3000,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles_owner" on profiles;
create policy "profiles_owner" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- 2. DAILY WEIGHT -------------------------------------------------------------
create table if not exists weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  weight_kg numeric not null,
  notes text,
  created_at timestamptz default now(),
  unique (user_id, entry_date)
);

alter table weight_entries enable row level security;
drop policy if exists "weight_owner" on weight_entries;
create policy "weight_owner" on weight_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. WAIST MEASUREMENTS --------------------------------------------------------
create table if not exists waist_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  waist_cm numeric not null,
  notes text,
  created_at timestamptz default now(),
  unique (user_id, entry_date)
);

alter table waist_entries enable row level security;
drop policy if exists "waist_owner" on waist_entries;
create policy "waist_owner" on waist_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. CALORIE ADJUSTMENT HISTORY (the "sweet spot" algorithm's decisions) ------
create table if not exists calorie_adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_ending date not null,
  previous_target integer not null,
  new_target integer not null,
  phase text not null, -- 'too_little' | 'on_target' | 'too_fast'
  reason text not null,
  overridden boolean default false,
  created_at timestamptz default now()
);

alter table calorie_adjustments enable row level security;
drop policy if exists "cal_adj_owner" on calorie_adjustments;
create policy "cal_adj_owner" on calorie_adjustments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. FOOD LIBRARY (reusable items, so you don't retype "oats" every day) ------
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  portion_desc text, -- e.g. "100g" or "1 cup"
  calories numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0,
  fibre_g numeric not null default 0,
  price_eur numeric,
  created_at timestamptz default now()
);

alter table foods enable row level security;
drop policy if exists "foods_owner" on foods;
create policy "foods_owner" on foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. DAILY FOOD DIARY -----------------------------------------------------------
create table if not exists food_log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  meal_type text not null, -- breakfast | lunch | dinner | snack | dessert | drink
  food_name text not null,
  portion_desc text,
  calories numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0,
  fibre_g numeric not null default 0,
  price_eur numeric,
  created_at timestamptz default now()
);

alter table food_log_entries enable row level security;
drop policy if exists "food_log_owner" on food_log_entries;
create policy "food_log_owner" on food_log_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7. MEAL PREP TEMPLATES (Phase 2 — table created now so it's ready) -----------
create table if not exists meal_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, -- e.g. "Breakfast - oats & banana"
  meal_type text not null,
  ingredients jsonb not null default '[]', -- [{food_id, name, qty, calories, protein, carbs, fat, price}]
  created_at timestamptz default now()
);

alter table meal_templates enable row level security;
drop policy if exists "meal_templates_owner" on meal_templates;
create policy "meal_templates_owner" on meal_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 8. PROGRESS PHOTOS (metadata only — actual images live in Supabase Storage) --
create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  angle text not null, -- front | side | back
  storage_path text not null,
  weight_kg numeric,
  notes text,
  created_at timestamptz default now()
);

alter table progress_photos enable row level security;
drop policy if exists "photos_owner" on progress_photos;
create policy "photos_owner" on progress_photos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Storage bucket for progress photos (private — only you can read your own).
-- Run this section too; it's idempotent.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

drop policy if exists "photo_storage_owner_select" on storage.objects;
create policy "photo_storage_owner_select" on storage.objects
  for select using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "photo_storage_owner_insert" on storage.objects;
create policy "photo_storage_owner_insert" on storage.objects
  for insert with check (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "photo_storage_owner_delete" on storage.objects;
create policy "photo_storage_owner_delete" on storage.objects
  for delete using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);
