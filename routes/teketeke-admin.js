// routes/teketeke-admin.js

const db = require('../firebase'); // ✅ Firestore DB instance

module.exports = function (app) {
  // 🔹 Register new SACCO
  app.post('/admin/register-sacco', async (req, res) => {
    const { name, contact, till, contractForm } = req.body;

    if (!name || !contact || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      const docRef = db.collection('saccos').doc(); // Auto-generate ID
      await docRef.set({ name, contact, till, contractForm });
      console.log('✅ Firestore SACCO saved:', name);
      res.json({ success: true, message: 'SACCO registered successfully' });
    } catch (err) {
      console.error('❌ Firestore error saving SACCO:', err.message);
      res.status(500).json({ success: false, message: 'Failed to save SACCO' });
    }
  });

  // 🔹 Register new Matatu
  app.post('/admin/register-matatu', async (req, res) => {
    const { owner, contact, vehicleType, plate, tlb, till, sacco } = req.body;

    if (!owner || !plate || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newMatatu = {
      owner,
      contact,
      vehicleType,
      plate,
      reg: plate,
      tlb,
      till,
      sacco
    };

    try {
      const docRef = db.collection('matatus').doc(); // Auto-generate ID
      await docRef.set(newMatatu);
      console.log('✅ Firestore Matatu saved:', plate);
      res.json({ success: true, message: 'Matatu registered successfully' });
    } catch (err) {
      console.error('❌ Firestore error saving Matatu:', err.message);
      res.status(500).json({ success: false, message: 'Failed to save Matatu' });
    }
  });

  // 🔍 Optional GET routes
  app.get('/admin/saccos', async (_, res) => {
    try {
      const snapshot = await db.collection('saccos').get();
      const saccos = snapshot.docs.map(doc => doc.data());
      res.json(saccos);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch SACCOs' });
    }
  });

  app.get('/admin/matatus', async (_, res) => {
    try {
      const snapshot = await db.collection('matatus').get();
      const matatus = snapshot.docs.map(doc => doc.data());
      res.json(matatus);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch Matatus' });
    }
  });
};
