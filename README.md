# Shop Perfume — Order Website

Premium React + Vite + TypeScript shopping UI with:
- Product categories
- Search
- Product cards
- Quantity controls
- Cart / bag
- Automatic subtotal and grand total
- Customer checkout form
- Telegram order sending through a private backend
- Responsive mobile UI
- Easy product/image replacement

## Structure

src/
  App.tsx                 Main shopping UI and cart logic
  data/products.ts        Product names, prices, sizes and image paths
  lib/telegram.ts         Frontend -> backend order request
  types.ts                TypeScript types
  styles.css              Premium dark UI

backend/
  server.js               Private API that sends orders to Telegram
  .env.example            Where Telegram credentials go

public/images/
  Put your own product images here.

## Run frontend

npm install
npm run dev

## Run Telegram backend

Open a second terminal:

cd backend
npm install

Copy `.env.example` to `.env` and replace:

TELEGRAM_BOT_TOKEN=YOUR_REAL_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_REAL_CHAT_ID

Then:

npm start

The frontend currently calls `/api/orders`. In production, deploy the backend/API under the same domain or configure a Vite proxy / reverse proxy.

## Telegram setup

1. In Telegram open @BotFather.
2. Send /newbot.
3. Create your shop bot.
4. Copy the bot token.
5. Send a message to your bot from the shop owner's Telegram account.
6. Find the owner's chat ID using your preferred Telegram bot/chat-ID method.
7. Put the token and chat ID ONLY in backend/.env.

IMPORTANT: Never put the Telegram bot token inside React code, localStorage, or a VITE_* frontend variable. Anyone can inspect browser JavaScript.

## Adding products

Edit `src/data/products.ts`.

Example:

{
  id: "p7",
  name: "My New Perfume",
  category: "Perfume",
  price: 2500,
  size: "100 ml",
  image: "/images/my-perfume.jpg",
  badge: "New"
}

Then put `my-perfume.jpg` in `public/images/`.

## Production architecture

Customer phone/browser
        |
        v
React + Vite shop
        |
        | POST /api/orders
        v
Private backend/API
        |
        | Telegram Bot API
        v
Shop owner's Telegram

The backend is important because the Telegram bot token must remain private.

## Future upgrades

- Admin dashboard
- Add/edit/delete products without editing code
- Stock management
- Order history
- Order status: New / Confirmed / Delivered
- Multiple shop owners
- Telegram inline buttons
- WhatsApp option
- Payment integration
- Customer accounts
- Delivery fee calculation
- Product variants and sizes
- Amharic/Tigrinya/English language switcher


## New customer confirmation flow

After a successful order, the customer sees a confirmation screen explaining:
- The order was sent to the shop.
- A confirmation text message (SMS) will be sent to their phone.
- The shop will contact them by phone to confirm the order.

The current project includes the UI and backend-ready structure. **Actual SMS delivery requires an SMS provider/API**; Telegram itself does not automatically send an SMS to a customer's phone number. When you choose a provider, its API credentials should be stored only in the backend `.env`.

## Language and theme

- English / Amharic selector in the top utility bar.
- Dark / Light mode toggle.
- Product and checkout labels switch with the selected language.

## Easy Product Image Setup

Product images are intentionally separated so adding or replacing an image is simple.

1. Put the image file in `public/images/`.
2. Open `src/data/image-config.ts`.
3. Change only the filename for the matching product.
4. No change is needed in `App.tsx` or `index.html`.

Example:
`noirElan: image("my-new-photo.webp")`

The file must exist at:
`public/images/my-new-photo.webp`
