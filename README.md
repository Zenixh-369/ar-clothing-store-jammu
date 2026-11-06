# AR Clothing — full-stack storefront

A multi-page Next.js App Router shop with Menswear, Womenswear, Tops, Bottomwear, Jackets, Footwear, Accessories, and New Arrivals categories with a custom floating cursor, editorial home page, category and product pages, persistent browser cart, server-side product API, validated checkout, and order recording.

## Start locally

1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local address printed in the terminal.

Use `npm run build` and `npm start` for a production build. `GET /api/products` serves the product catalog. `POST /api/orders` validates items against server-side prices, validates products against server-side prices and returns a WhatsApp handoff without writing orders to the local filesystem. The customer is redirected to WhatsApp with order ID, item names, sizes, quantities, subtotal, and shipping details and the selected payment preference. Payment is not processed on the site; the preference is confirmed with the shop in WhatsApp. Set `WHATSAPP_PHONE` to override the default international number `918899279169` (digits only).

The app uses a sample catalog and USD prices. Replace the catalog, contact details, and imagery before launch. The order file is suitable for a local starter; use a managed database for multi-instance production and connect a payment provider if you want card checkout.
