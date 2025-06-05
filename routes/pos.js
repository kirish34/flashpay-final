// routes/pos.js (Firebase version)
const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Create a new POS bill
router.post('/pos/send-bill', async (req, res) => {
  const { amount, phone, tillNumber } = req.body;

  if (!amount || !phone || !tillNumber) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const txCode = Math.floor(1000 + Math.random() * 9000).toString();
  const newBill = {
    txCode,
    amount,
    phone,
    till: tillNumber,
    status: 'pending',
    createdAt: Date.now(),
  };

  await db.collection('pos_bills').doc(txCode).set(newBill);
  console.log(`🧾 POS Bill: ${txCode} - KES ${amount} for ${phone}`);
  res.json({ success: true, txCode, message: 'Bill created, waiting for payment' });
});

// Check TX status
router.get('/pos/check/:code', async (req, res) => {
  const doc = await db.collection('pos_bills').doc(req.params.code).get();
  if (!doc.exists) return res.status(404).json({ success: false, message: 'TX not found' });

  res.json({ success: true, status: doc.data().status || 'pending' });
});

module.exports = router;
