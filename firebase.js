const admin = require('firebase-admin');

if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FB_CLIENT_EMAIL
    })
  });

  module.exports = admin.firestore();
} else {
  // Provide a minimal mock during tests to avoid credential errors
  module.exports = {
    collection: () => ({
      doc: () => ({
        set: async () => {},
        get: async () => ({ docs: [] })
      })
    })
  };
}
