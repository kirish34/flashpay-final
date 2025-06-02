const admin = require('firebase-admin');

const serviceAccount = {
  projectId: process.env.FB_PROJECT_ID,
  privateKeyId: process.env.FB_PRIVATE_KEY_ID,
  privateKey: (process.env.FB_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FB_CLIENT_EMAIL,
  clientId: process.env.FB_CLIENT_ID,
  client_x509_cert_url: process.env.FB_CLIENT_CERT
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
