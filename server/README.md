# Royal Hotels — Payment Backend (Express + Razorpay)

Production-style Razorpay integration. The **Key Secret stays on the server** and
every payment is verified with an HMAC signature before being marked paid.

```
server/
├── index.js                       # app entry: env, middleware, mounts routes
├── config/razorpay.js             # Razorpay SDK instance + key config
├── controllers/payment.controller.js  # create order, verify signature, store
├── routes/payment.routes.js       # /api/payment/* endpoints
├── models/Payment.js              # payment store ("database" → data/payments.json)
├── data/payments.json             # auto-created; git-ignored
└── .env                           # YOUR KEYS GO HERE (git-ignored)
```

## Where to put your keys  🔑
Open **`server/.env`** (create it from `.env.example` if missing) and set:
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx     # public — also sent to the browser for checkout
RAZORPAY_KEY_SECRET=your_secret_here        # PRIVATE — never leaves this file/server
PORT=5000
```
- **Key ID** → `server/.env` (the backend forwards it to the frontend automatically; you do **not** hardcode it in React).
- **Key Secret** → `server/.env` **only**. Never in React, never in git, never in chat.

Get them at: Razorpay Dashboard → **Settings → API Keys → Generate Test Key**.

## Run
```bash
cd server
npm install
npm start        # or: npm run dev (auto-restart)
```
Expect: `Razorpay: configured (TEST mode)`  ·  health → <http://localhost:5000/api/payment/health>

## API
| Method | Path                          | Body                                                        | Returns |
|--------|-------------------------------|-------------------------------------------------------------|---------|
| GET    | `/api/payment/health`         | —                                                           | `{ ok, keysConfigured, keyId, mode }` |
| POST   | `/api/payment/create-order`   | `{ amount (₹), receipt?, customer? }`                       | `{ success, orderId, amount, currency, keyId }` |
| POST   | `/api/payment/verify-payment` | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, method? }` | `{ success, paymentId }` |
| GET    | `/api/payment/payments`       | —                                                           | stored payments (debug/admin) |

## Test payment
Card `4111 1111 1111 1111`, any future expiry, any CVV, any name. No real money in Test Mode.

## Swap the store for a real database
`models/Payment.js` is the only file that touches storage. Replace the JSON
read/write helpers with Mongoose/Prisma/pg calls — the exported functions
(`createPaymentRecord`, `markPaid`, `markFailed`, `getByOrderId`, `getAllPayments`)
keep the same signatures, so nothing else changes.
