# Unyt Mart POS - Full-Stack React & Firebase

A modern, high-performance, real-time Cloud Point of Sale (POS) and Courier Dispatch management application built with **React 19**, **Vite**, **Tailwind CSS**, and **Firebase (Cloud Firestore & Authentication)**. Configured for zero-config **Vercel** deployment.

---

## 🚀 Features

- **Real-Time Cloud Synchronization**: Real-time multi-device sync via Firebase Cloud Firestore (`onSnapshot` listeners). Offline fallback cache with `localStorage`.
- **Firebase Authentication**: Multi-device login, user registration, and secure email/password credential management.
- **POS Billing & Cart**:
  - Live search by product name, SKU, or barcode scanner.
  - Category filtering carousel.
  - Stock validation (prevents overselling).
  - Configurable delivery fees, free delivery waiving, and separate receipt display options.
  - Live discount calculation.
- **Dispatch & Payment**:
  - Payment methods: Cash on Delivery (COD), Bank Transfer / Paid, Cash Store Pickup.
  - Automatic COD amount calculation.
  - Cash tendered and change/balance calculation.
  - Customer shipping details: Name, WhatsApp Phone, Address, Courier Tracking Reference.
- **Receipt & Invoice Printing**:
  - **Thermal Receipt** (58mm, 80mm).
  - **A6, A5, and A4** invoice formats.
  - **Dual Landscape Print Mode**: Splits page to print Customer Copy & Merchant Copy side-by-side on a single sheet.
  - Courier barcode placeholder box.
- **WhatsApp Web Integration**:
  - One-click formatted receipt generation sent directly to customer's WhatsApp via `wa.me`.
- **Inventory Management**:
  - Add, edit, delete products with low-stock threshold alerts.
  - Export and Import product database via JSON.
- **Financial Statement & Ledger**:
  - Gross revenue, delivery fee breakdown, and net revenue.
  - Date range filtering (From - To).
  - Professional portrait A4 financial statement printout with authorized signature line.
- **Analytics & Reports**:
  - Today's sales & profit tracking.
  - Monthly revenue & total orders.
  - Payment method distribution charts & top 5 bestsellers.
- **Pluggable API Integrations**:
  - Modular integration hooks ready in `src/services/integrations.js` for Courier APIs (Domex, Prompt, Koombiyo, Fardar), SMS Gateways, and Online Payment Gateways.

---

## 🛠️ Project Structure

```text
POS/
├── .env                       # Environment variables (Firebase & API keys)
├── .env.example               # Example template for Vercel
├── vercel.json                # Vercel SPA deployment configuration
├── vite.config.js             # Vite build & server configuration
├── tailwind.config.js         # Tailwind CSS styling & theme extensions
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies and build scripts
├── index.html                 # HTML shell with print media stylesheets
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Core application layout & routing
    ├── index.css              # Tailwind directives, scrollbars, print styles
    ├── firebase/
    │   ├── config.js          # Firebase app, auth & firestore init
    │   ├── authService.js     # Login, signup, credentials update
    │   └── dataService.js     # Firestore real-time sync & local fallback
    ├── context/
    │   ├── AuthContext.jsx    # Authentication context provider
    │   └── POSContext.jsx     # POS state, cart, inventory, and ledger store
    ├── services/
    │   ├── whatsappService.js # Formatted WhatsApp Web receipts
    │   └── integrations.js    # Courier, SMS, Payment Gateway integration hub
    └── components/
        ├── layout/            # Header, Sidebar, Live Clock, Cloud sync badge
        ├── modals/            # AuthModal (Login / Signup)
        ├── pos/               # POSView, ProductCard, Cart, PaymentModal
        ├── dashboard/         # DashboardView (metrics & stock alerts)
        ├── products/          # ProductsView, ProductModal (CRUD & import/export)
        ├── history/           # HistoryView (orders, WhatsApp & print actions)
        ├── finance/           # FinanceView (ledger & A4 statement)
        ├── reports/           # ReportsView (analytics & distribution)
        ├── settings/          # SettingsView (store configuration & security)
        └── print/             # ReceiptPrintWrapper & FinancePrintWrapper
```

---

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. Framework Preset will be automatically detected as **Vite**.
5. In **Environment Variables**, add the keys from `.env` (or copy `.env.example`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
6. Click **Deploy**. Vercel will build and deploy the application with full SPA routing handled by `vercel.json`.

---

## 🔌 Connecting External APIs (Courier, SMS, Payment)

When you receive your API credentials:
1. Add the URLs and tokens into `.env` (and Vercel Environment Variables):
   ```env
   VITE_COURIER_API_URL=https://api.yourcourier.com/v1/dispatch
   VITE_COURIER_API_KEY=your_courier_api_key

   VITE_SMS_API_URL=https://api.sms-gateway.com/send
   VITE_SMS_API_KEY=your_sms_api_key

   VITE_PAYMENT_GATEWAY_URL=https://api.payment-gateway.com/charge
   VITE_PAYMENT_GATEWAY_KEY=your_payment_key
   ```
2. Open [`src/services/integrations.js`](file:///c:/Users/rusir/Desktop/POS/src/services/integrations.js) to adjust the payload format according to your specific provider's API docs. The order finalization workflow in [`PaymentModal.jsx`](file:///c:/Users/rusir/Desktop/POS/src/components/pos/PaymentModal.jsx) is already linked to call these functions automatically!

