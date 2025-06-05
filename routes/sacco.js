// routes/sacco.js (Firebase version)
const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Save daily fee settings
router.post('/add-fee-setting', async (req, res) => {
  const newEntry = { ...req.body, timestamp: Date.now() };
  await db.collection('feeSettings').add(newEntry);
  res.json({ success: true });
});

// Save saving settings
router.post('/add-saving-setting', async (req, res) => {
  const newEntry = { ...req.body, timestamp: Date.now() };
  await db.collection('savingSettings').add(newEntry);
  res.json({ success: true });
});

// Get all deductions
router.get('/deductions-log', async (req, res) => {
  const snapshot = await db.collection('deductions').get();
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ records });
});

// Get fee tracking with optional filters
router.get('/fee-tracking', async (req, res) => {
  const { date, status } = req.query;
  let query = db.collection('fees');

  const snapshot = await query.get();
  let filtered = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (date) {
    filtered = filtered.filter(fee => {
      const entryDate = new Date(fee.timestamp).toISOString().slice(0, 10);
      return entryDate === date;
    });
  }

  if (status) {
    filtered = filtered.filter(fee => fee.status.toLowerCase() === status.toLowerCase());
  }

  res.json(filtered);
});

// Confirm daily payment manually
router.post('/confirm-payment', async (req, res) => {
  const { matatuCode, amount, note } = req.body;
  if (!matatuCode || !amount) {
    return res.status(400).json({ error: 'matatuCode and amount are required' });
  }

  const newEntry = {
    matatuCode,
    amount,
    note: note || '',
    status: 'confirmed',
    timestamp: Date.now()
  };

  await db.collection('fees').add(newEntry);
  res.json({ success: true, entry: newEntry });
});

module.exports = router;
