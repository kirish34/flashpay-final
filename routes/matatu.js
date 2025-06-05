// routes/matatu.js (Firebase version)
const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// GET /api/matatu/transactions/:code
router.get('/transactions/:code', async (req, res) => {
  const snapshot = await db.collection('transactions').where('matatuCode', '==', req.params.code).get();
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(records);
});

// GET /api/matatu/savings/:code
router.get('/savings/:code', async (req, res) => {
  const snapshot = await db.collection('savings').where('matatuCode', '==', req.params.code).get();
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(records);
});

// POST /api/matatu/request-loan
router.post('/request-loan', async (req, res) => {
  const { matatuCode, amount, plan } = req.body;
  if (!matatuCode || !amount || !plan) return res.status(400).json({ success: false });

  const newLoan = {
    matatuCode,
    amount: Number(amount),
    plan,
    timestamp: Date.now(),
    status: 'pending'
  };
  await db.collection('loans').add(newLoan);
  res.json({ success: true });
});

// GET /api/matatu/payments?till=XXXXX
router.get('/payments', async (req, res) => {
  const { till } = req.query;
  if (!till) return res.status(400).json({ error: 'Missing till number' });

  const today = new Date().toISOString().split('T')[0];
  const snapshot = await db.collection('matatu_payments').where('till', '==', till).get();
  const records = snapshot.docs.map(doc => doc.data()).filter(p => {
    const pDate = new Date(p.timestamp).toISOString().split('T')[0];
    return pDate === today;
  });

  res.json(records);
});

module.exports = router;
