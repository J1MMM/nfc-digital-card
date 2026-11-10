# Tapcard Studio — Vercel + Supabase

A responsive digital calling card app. One admin creates and edits cards at `/admin`; each card has a permanent `/c/[slug]` URL for an NFC tag. Visitors can call, text, email, open social links, copy details, and download a vCard.

## Stack

- Next.js 16 on Vercel: pages, server actions, and routes
- Supabase Postgres: cards
- Supabase Storage: photos in a private `photos` bucket

The Supabase secret key is used only on the server. Visitors never receive database credentials. The current admin setup uses one shared admin password; it has no per-person account module.

## Deploy to your accounts

1. Create a Supabase project. In its SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
   If you already deployed the earlier package, run [`supabase/migrations/001_add_tiktok.sql`](supabase/migrations/001_add_tiktok.sql) instead to add TikTok without changing existing cards.
2. In Supabase Storage, create a **private** bucket named `photos`. Set a 3 MB file size limit and allow JPG, PNG, WebP, and AVIF images.
3. Push this folder to a Git repository you control and import it as a Next.js project in Vercel.
4. Add the four environment variables below in Vercel Project Settings → Environment Variables, then deploy. Create your own new values for the admin password and session secret.

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | Project URL from Supabase Connect / API settings |
| `SUPABASE_SECRET_KEY` | `sb_secret_...` key from Supabase API Keys; server only |
| `ADMIN_PASSWORD` | A new strong password for `/admin/login` |
| `SESSION_SECRET` | A new random secret, at least 32 characters |

Open the Vercel URL, log in at `/admin/login`, create a card, and copy its public URL into the NFC tag. For a branded address, add your domain in Vercel before programming tags. Edits keep the same card URL.

Vercel's free Hobby plan is limited to personal, non-commercial use. If these are business calling cards, choose a Vercel plan that permits commercial use. Supabase has a free plan with usage limits; check its current limits before launch.

## Local development

Use Node.js 22.13 or newer. Copy `env.example` to `.env.local`, fill in your own values, then run:

```sh
npm ci
npm run dev
```

Run `npm test`, `npx tsc --noEmit`, and `npm run build` to verify the project.

## Existing ChatGPT-hosted site

This is a separate deployment. It does not copy cards or photos from the ChatGPT-hosted site. Keep that site live while you set this one up, recreate or migrate any existing cards, and verify the new public links. NFC tags programmed with the old domain must be updated to the new URL. You can keep the old site as your rollback until the new links work.

## Notes

The public profile and vCard routes expose contact information by design. The cards table has Row Level Security enabled with no browser policies. Only server code using `SUPABASE_SECRET_KEY` reads or writes it. Photo files are kept in a private bucket and served through the app's `/media/[key]` route.
