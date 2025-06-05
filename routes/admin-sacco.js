// routes/sacco-admin.js (Firebase version)
const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Register SACCO
router.post('/api/admin/register-sacco', async (req, res) => {
  const newSacco = { ...req.body, timestamp: Date.now() };
  const ref = await db.collection('saccos').add(newSacco);
  res.json({ success: true, sacco: { id: ref.id, ...newSacco } });
});

// Update SACCO
router.post('/api/admin/update-sacco', async (req, res) => {
  const { id, ...fields } = req.body;
  await db.collection('saccos').doc(id).update(fields);
  res.json({ success: true });
});

// Delete SACCO
router.delete('/api/admin/delete-sacco/:id', async (req, res) => {
  await db.collection('saccos').doc(req.params.id).delete();
  res.json({ success: true });
});

// Register Matatu
router.post('/api/admin/register-matatu', async (req, res) => {
  const newMatatu = { ...req.body, timestamp: Date.now() };
  const ref = await db.collection('matatus').add(newMatatu);
  res.json({ success: true, matatu: { id: ref.id, ...newMatatu } });
});

// Update Matatu
router.post('/api/admin/update-matatu', async (req, res) => {
  const { id, ...fields } = req.body;
  await db.collection('matatus').doc(id).update(fields);
  res.json({ success: true });
});

// Delete Matatu
router.delete('/api/admin/delete-matatu/:id', async (req, res) => {
  await db.collection('matatus').doc(req.params.id).delete();
  res.json({ success: true });
});

// Transactions - Fees
router.get('/api/admin/transactions/fees', async (req, res) => {
  const snapshot = await db.collection('sacco_tx_fees').get();
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(records);
});

// Transactions - Loans
router.get('/api/admin/transactions/loans', async (req, res) => {
  const snapshot = await db.collection('sacco_tx_loans').get();
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(records);
});

module.exports = router;
