-- Run once in your Supabase project's SQL Editor.
create table if not exists public.cards (
  id uuid primary key,
  slug text not null unique,
  name text not null,
  title text not null default '',
  company text not null default '',
  bio text not null default '',
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  linkedin text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  x text not null default '',
  tiktok text not null default '',
  photo_key text not null default '',
  created_at bigint not null,
  updated_at bigint not null
);

-- The browser has no database credentials. Only server code using the secret key
-- accesses this table; no anonymous or authenticated client policies are added.
alter table public.cards enable row level security;
