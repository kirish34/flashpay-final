// POS listener service// pos-listener.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

global.activeBills = global.activeBills || {};
const BILL_TTL = parseInt(process.env.ACTIVE_BILL_TTL, 10) || 5 * 60 * 1000; // default 5 minutes
const { startBillCleanup } = require('./cleanup');

startBillCleanup(global.activeBills, BILL_TTL);

// Listener route for POS TX injections
app.post('/newtx', (req, res) => {
  const { amount, phone, tillNumber } = req.body;

  if (!amount || !phone || !tillNumber) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const txCode = Math.floor(1000 + Math.random() * 9000).toString();

  global.activeBills = global.activeBills || {};
  global.activeBills[txCode] = {
    amount,
    phone,
    till: tillNumber,
    status: 'pending',
    createdAt: Date.now(),
  };

  console.log(`🧾 New POS TX: ${txCode} - ${amount} for ${phone}`);
  res.json({ success: true, txCode });
});

app.listen(PORT, () => {
  console.log(`📡 POS Listener running at http://localhost:${PORT}`);
});
