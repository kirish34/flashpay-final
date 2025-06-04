# FlashPay + TekeTeke

Instructions and project overview.

## Environment Variables

Create a `.env` file or export the following variables before starting the
application:

- `PORT` - Port for the Express server (defaults to `10000`).
- `FB_PROJECT_ID` - Firebase project identifier.
- `FB_PRIVATE_KEY_ID` - Key ID of the Firebase service account.
- `FB_PRIVATE_KEY` - Private key of the Firebase service account. When using a
  `.env` file, replace actual newline characters with `\n`.
- `FB_CLIENT_EMAIL` - Service account client email.
- `FB_CLIENT_ID` - Service account client ID.
- `FB_CLIENT_CERT` - URL to the service account certificate.
