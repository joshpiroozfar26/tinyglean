# TinyGlean — real MVP

A real, configurable SaaS MVP: Google OAuth → Gmail/Drive search → OpenAI answer → source links → Stripe checkout.

## 1. Install
```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2. Create Supabase project
In Supabase Auth > Providers > Google, enable Google and enter the OAuth client ID/secret from Google Cloud.
Set Site URL to `http://localhost:3000` for local development and add your production URL later.

## 3. Google Cloud
Create an OAuth Web application. Enable **Gmail API** and **Google Drive API**. Add the Supabase callback URL shown in Supabase's Google provider settings as an authorised redirect URI.
The app requests these scopes:
- `openid email profile`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/drive.readonly`

During development Google may require your account to be added as an OAuth test user. Wider public launch may require Google OAuth verification because Gmail is a sensitive scope.

## 4. OpenAI
Set `OPENAI_API_KEY`. Search results from Gmail and readable Drive files are sent to the model to generate a grounded answer.

## 5. Stripe
Create a recurring £49/month product/price and put its Price ID in `STRIPE_PRICE_ID`, plus your secret key in `STRIPE_SECRET_KEY`.

## 6. Deploy
Push this folder to GitHub and import it into Vercel, or run `vercel` from this folder. Copy every env var into Vercel's Environment Variables settings and update `NEXT_PUBLIC_SITE_URL`.

## MVP limitations
- Searches Gmail using Google's search syntax from the user's query.
- Drive v1 reads Google Docs and text files; PDFs/Office files need extraction added next.
- Provider token is used only during the signed-in browser session; production should add durable Google token refresh handling.
- Add billing entitlement checks before public launch.
- Notion is intentionally deferred until Gmail + Drive proves demand.

## Product promise
**Search your whole company like Google — without an enterprise contract.**


TinyGlean live build
