# Seekly

Find anything in your business. Seekly searches Gmail and Google Drive from one simple interface.

## Required Vercel environment variables

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

You can use NEXT_PUBLIC_SUPABASE_ANON_KEY instead of the publishable key.

## Google / Supabase
Enable Google OAuth in Supabase and request Gmail readonly + Drive readonly scopes. Add your deployed URL `/auth/callback` to the allowed redirect URLs.

## Deploy
The app is Next.js and deploys directly on Vercel. `npm run build` is the production build command.
