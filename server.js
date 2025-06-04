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

// TTL cleanup configuration
const BILL_TTL = parseInt(process.env.ACTIVE_BILL_TTL, 10) || 5 * 60 * 1000; // default 5 minutes
const { startBillCleanup } = require('./cleanup');

// Periodically remove expired bills
startBillCleanup(global.activeBills, BILL_TTL);

// Load shared JSON data
global.users = fs.readJsonSync(path.join(__dirname, 'data/users.json'), { throws: false }) || [];
global.txCodes = fs.readJsonSync(path.join(__dirname, 'data/txcodes.json'), { throws: false }) || [];
global.teketekeTx = fs.readJsonSync(path.join(__dirname, 'data/teketeke_tx.json'), { throws: false }) || [];

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
