# FlashPay + TekeTeke

Instructions and project overview.

## Environment Variables

Create a `.env` file or export the following variables before starting the
application:

- `PORT` - Port for the Express server (defaults to `10000`).
- `FB_PROJECT_ID` - Firebase project identifier.
- `FB_PRIVATE_KEY` - Private key of the Firebase service account. When using a
  `.env` file, replace actual newline characters with `\n`.
- `FB_CLIENT_EMAIL` - Service account client email.

The following variables are optional and currently unused by `firebase.js`:

- `FB_PRIVATE_KEY_ID` - Key ID of the Firebase service account (unused by `firebase.js`)
- `FB_CLIENT_ID` - Service account client ID (unused by `firebase.js`)
- `FB_CLIENT_CERT` - URL to the service account certificate (unused by `firebase.js`)
