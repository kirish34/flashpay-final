// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store
global.activeBills = {}; // example: { txcode123: { amount, phone, status } }

// Helper to load JSON files asynchronously
async function loadJson(file) {
  try {
    return await fs.readJson(path.join(__dirname, file));
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return [];
  }
}

(async () => {
  // Load shared JSON data
  global.users = await loadJson('data/users.json');
  global.txCodes = await loadJson('data/txcodes.json');
  global.teketekeTx = await loadJson('data/teketeke_tx.json');

  // Load Routes
  require('./routes/login')(app);
  require('./routes/flashpay')(app);
  require('./routes/teketeke')(app);
  require('./routes/pos')(app);
  require('./routes/admin')(app);
  require('./routes/callback')(app);
  require('./routes/dashboard')(app);
  require('./routes/branches')(app);
  require('./routes/cashiers')(app);
  require('./routes/teketeke-admin')(app);

  app.listen(PORT, () => {
    console.log(`🚀 Flash Pay backend running at http://localhost:${PORT}`);
  });
})();
