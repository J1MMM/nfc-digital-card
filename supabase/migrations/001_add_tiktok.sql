-- For an existing Supabase project created from the earlier package.
-- Keep the old X column and its data for rollback; the app no longer displays it.
alter table public.cards add column if not exists tiktok text not null default '';
