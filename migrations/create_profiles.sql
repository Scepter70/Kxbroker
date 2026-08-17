-- migrations/create_profiles.sql
-- Run these statements in your Supabase project's SQL editor (in order).

-- 1) Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer',
  created_at timestamptz default now()
);

-- 2) Enable row-level security
alter table public.profiles enable row level security;

-- 3) Policies: allow users to select/insert their own profile
create policy "Users can select own profile" on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert
  with check (auth.uid() = id);

-- 4) (Optional) Helper: promote a user to admin
-- Replace <USER_UUID> with the UUID returned by: select id from auth.users where email = 'admin@example.com';
insert into public.profiles (id, full_name, role)
values ('<USER_UUID>', 'Site Admin', 'admin')
on conflict (id) do update set role = 'admin', full_name = excluded.full_name;
