// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

// Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
global.firestore = db;

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// In-memory store (used temporarily for active M-PESA bills)
global.activeBills = {};

// Utility: Load JSON files for fallback/testing (optional)
async function loadJson(file) {
  try {
    return await fs.readJson(path.join(__dirname, file));
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return [];
  }
}

(async () => {
  // Optional JSON loading (for offline or legacy fallback)
  global.users = await loadJson('data/users.json');
  global.txCodes = await loadJson('data/txcodes.json');
  global.teketekeTx = await loadJson('data/teketeke_tx.json');

  // Load Routes
  require('./routes/login')(app);
  require('./routes/flashpay')(app);
  require('./routes/teketeke')(app);
  app.use('/api', require('./routes/pos'));
  require('./routes/admin')(app);
  app.use(require('./routes/admin-sacco'));
  app.use('/api/sacco', require('./routes/sacco'));
  app.use('/api/matatu', require('./routes/matatu'));
  require('./routes/callback')(app);
  require('./routes/status')(app);
  require('./routes/dashboard')(app);
  require('./routes/branches')(app);
  require('./routes/cashiers')(app);

  // Serve static login/dashboard routes
  app.get('/login', (_, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
  app.get('/teketeke-dashboard.html', (_, res) => res.sendFile(path.join(__dirname, 'public', 'teketeke-dashboard.html')));
  app.get('/sacco-dashboard.html', (_, res) => res.sendFile(path.join(__dirname, 'public', 'sacco-dashboard.html')));
  app.get('/matatu-dashboard.html', (_, res) => res.sendFile(path.join(__dirname, 'public', 'matatu-dashboard.html')));

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Flash Pay backend running at http://localhost:${PORT}`);
  });
})();
