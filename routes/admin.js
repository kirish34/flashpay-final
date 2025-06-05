// routes/admin.js (Firebase version)
const express = require('express');
const router = express.Router();
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// ========== SUPERMARKETS ==========
router.post('/register-supermarket', async (req, res) => {
  const { name } = req.body;
  const ref = db.collection('supermarkets');
  const existing = await ref.where('name', '==', name).get();
  if (!existing.empty) return res.json({ message: 'Supermarket already exists' });
  await ref.add({ name });
  res.json({ message: 'Supermarket registered' });
});

router.get('/supermarkets', async (req, res) => {
  const snapshot = await db.collection('supermarkets').get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

router.post('/delete-supermarket', async (req, res) => {
  const { name } = req.body;
  const ref = db.collection('supermarkets');
  const snapshot = await ref.where('name', '==', name).get();
  snapshot.forEach(doc => doc.ref.delete());
  res.json({ message: 'Supermarket deleted' });
});

router.post('/edit-supermarket', async (req, res) => {
  const { original, newName } = req.body;
  const ref = db.collection('supermarkets');
  const snapshot = await ref.where('name', '==', original).get();
  if (snapshot.empty) return res.json({ message: 'Supermarket not found' });
  snapshot.forEach(doc => doc.ref.update({ name: newName }));
  res.json({ message: 'Supermarket updated' });
});

// ========== BRANCHES ==========
router.post('/register-branch', async (req, res) => {
  const { supermarket, name, tillNumber } = req.body;
  await db.collection('branches').add({ supermarket, name, tillNumber });
  res.json({ message: 'Branch registered' });
});

router.get('/branches', async (req, res) => {
  const { supermarket } = req.query;
  const snapshot = await db.collection('branches').where('supermarket', '==', supermarket).get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

router.post('/delete-branch', async (req, res) => {
  const { supermarket, name } = req.body;
  const snapshot = await db.collection('branches')
    .where('supermarket', '==', supermarket)
    .where('name', '==', name)
    .get();
  snapshot.forEach(doc => doc.ref.delete());
  res.json({ message: 'Branch deleted' });
});

router.post('/edit-branch', async (req, res) => {
  const { supermarket, original, newName } = req.body;
  const snapshot = await db.collection('branches')
    .where('supermarket', '==', supermarket)
    .where('name', '==', original)
    .get();
  if (snapshot.empty) return res.json({ message: 'Branch not found' });
  snapshot.forEach(doc => doc.ref.update({ name: newName }));
  res.json({ message: 'Branch updated' });
});

// ========== CASHIERS ==========
router.post('/register-cashier', async (req, res) => {
  const { branch, cashierId, ussdCode } = req.body;
  await db.collection('cashiers').add({ branch, cashierId, ussdCode });
  res.json({ message: 'Cashier registered' });
});

router.get('/cashiers', async (req, res) => {
  const { branch } = req.query;
  const snapshot = await db.collection('cashiers').where('branch', '==', branch).get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

router.post('/delete-cashier', async (req, res) => {
  const { branch, cashierId } = req.body;
  const snapshot = await db.collection('cashiers')
    .where('branch', '==', branch)
    .where('cashierId', '==', cashierId)
    .get();
  snapshot.forEach(doc => doc.ref.delete());
  res.json({ message: 'Cashier deleted' });
});

router.post('/edit-cashier', async (req, res) => {
  const { branch, cashierId, newUssd } = req.body;
  const snapshot = await db.collection('cashiers')
    .where('branch', '==', branch)
    .where('cashierId', '==', cashierId)
    .get();
  if (snapshot.empty) return res.json({ message: 'Cashier not found' });
  snapshot.forEach(doc => doc.ref.update({ ussdCode: newUssd }));
  res.json({ message: 'Cashier updated' });
});

module.exports = (app) => app.use('/api/admin', router);
