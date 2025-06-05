// routes/cashiers.js (Firebase version)
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const ussdPrefix = '*123*'; // your USSD base code

module.exports = function (app) {
  // Get all cashiers
  app.get('/admin/cashiers', async (_, res) => {
    try {
      const snapshot = await db.collection('cashiers').get();
      const cashiers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(cashiers);
    } catch (err) {
      console.error('🔥 Error fetching cashiers:', err);
      res.status(500).json({ success: false });
    }
  });

  // Add new cashier
  app.post('/admin/cashiers/add', async (req, res) => {
    const { branchName, cashierId } = req.body;
    if (!branchName || !cashierId) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const base = getBranchDigit(branchName);
    const checksum = base - cashierId;
    const code = `${ussdPrefix}${base}${cashierId}${checksum}#`;

    const newCashier = {
      branchName,
      cashierId,
      ussdCode: code,
      status: 'active'
    };

    try {
      await db.collection('cashiers').add(newCashier);
      res.json({ success: true, cashier: newCashier });
    } catch (err) {
      console.error('🔥 Error adding cashier:', err);
      res.status(500).json({ success: false });
    }
  });

  // Delete cashier
  app.post('/admin/cashiers/delete', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });

    try {
      await db.collection('cashiers').doc(id).delete();
      res.json({ success: true });
    } catch (err) {
      console.error('🔥 Error deleting cashier:', err);
      res.status(500).json({ success: false });
    }
  });

  function getBranchDigit(name) {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 9) + 1; // branch digit 1–9
  }
};
