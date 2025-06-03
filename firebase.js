require('dotenv').config(); // Add this at the top
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FB_CLIENT_EMAIL
  })
});

const db = admin.firestore();
module.exports = db;
