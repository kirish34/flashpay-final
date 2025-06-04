# FlashPay + TekeTeke

Instructions and project overview.

## Setup

This project requires **Node.js 18** or later.

### Installation

1. Install dependencies:

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root. A template is provided in `.env.example`:

```env
FB_PROJECT_ID=flashpay-teketeke
FB_PRIVATE_KEY_ID=your_key_id
FB_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqh...==\n-----END PRIVATE KEY-----\n
FB_CLIENT_EMAIL=firebase-adminsdk-xxx@flashpay-teketeke.iam.gserviceaccount.com
FB_CLIENT_ID=12345678901234567890
FB_CLIENT_CERT=https://www.googleapis.com/robot/v1/metadata/x509/...
PORT=10000
```

Replace the Firebase credentials with your own service account details.

### Starting the server

Start the Express backend:

```bash
npm start
```

This runs `server.js` on port `10000` by default. For POS transaction testing, you can also run the listener service:

```bash
npm run listener
```

## Required services

- **Firebase** – Firestore is used as the data store. The application requires Firebase service account credentials configured via the environment variables above.
