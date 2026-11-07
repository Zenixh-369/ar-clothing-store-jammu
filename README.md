# AR Clothing — storefront and product admin

A Next.js storefront with a password-protected product dashboard. The dashboard edits the shared Supabase catalog, so product changes, prices, categories, and uploaded images appear on the storefront without editing code.

## Run locally

1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the values described below.
4. Run `npm run dev` and open the local address printed in the terminal.

## Connect Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/setup.sql`](supabase/setup.sql). It creates the products table, adds the starter catalog, and creates the public `products` image bucket.
3. In **Project Settings → API Keys**, copy the project URL and create or copy a `secret` key. Keep it server-side; never prefix it with `NEXT_PUBLIC_`. The app also accepts the legacy `service_role` key as `SUPABASE_SERVICE_ROLE_KEY`.
4. Set these environment variables in `.env.local` for local development and in Vercel under **Project Settings → Environment Variables** for the deployed site:
   - `SUPABASE_URL` — project URL.
   - `SUPABASE_SECRET_KEY` — server-only Supabase secret key. If using an existing legacy key, use `SUPABASE_SERVICE_ROLE_KEY` instead.
   - `ADMIN_PASSWORD` — a long, unique dashboard password.
   - `ADMIN_SESSION_SECRET` — a random secret at least 32 characters long.
   - `WHATSAPP_PHONE` — required; WhatsApp number in international digits with no `+`, spaces, or punctuation.
   - `NEXT_PUBLIC_WHATSAPP_PHONE` — required; set to the same number for the client-side checkout fallback.
5. Restart the local dev server or redeploy the Vercel project after changing environment variables.

Open `/admin` on the site to sign in. The dashboard can add, edit, search, and delete products; set price, category, collections, featured and new arrival status; and upload product images. Images accept JPG, PNG, WebP, and AVIF up to 4 MB. The storefront reads the catalog directly from Supabase for each request. Existing items in a customer's bag refresh to the latest price when the bag opens.

Without Supabase environment variables, the storefront uses the starter catalog in `lib/products.js`; admin editing and uploads are unavailable. Checkout sends the order to WhatsApp and does not process payment or save an order record in a database.
