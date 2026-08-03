create extension if not exists pgcrypto;

create table if not exists public.user_logins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  logged_in_at timestamptz not null default now()
);

alter table public.user_logins enable row level security;

drop policy if exists "Users can insert their own login record" on public.user_logins;
create policy "Users can insert their own login record"
  on public.user_logins
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admins can view all login records" on public.user_logins;
create policy "Admins can view all login records"
  on public.user_logins
  for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
