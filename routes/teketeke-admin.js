const db = require('../firebase');

module.exports = function (app) {
  // 🔹 Register new SACCO
  app.post('/admin/register-sacco', async (req, res) => {
    const { name, contact, till, contractForm } = req.body;

    if (!name || !contact || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newSacco = { name, contact, till, contractForm };

    try {
      await db.collection('saccos').add(newSacco);
      console.log('✅ SACCO saved to Firebase:', newSacco);
      res.json({ success: true, message: 'SACCO registered successfully' });
    } catch (err) {
      console.error('❌ Failed to save SACCO to Firebase:', err.message);
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
      await db.collection('matatus').add(newMatatu);
      console.log('✅ Matatu saved to Firebase:', newMatatu);
      res.json({ success: true, message: 'Matatu registered successfully' });
    } catch (err) {
      console.error('❌ Failed to save Matatu to Firebase:', err.message);
      res.status(500).json({ success: false, message: 'Failed to save Matatu' });
    }
  });

  // 🔹 View all SACCOs
  app.get('/admin/saccos', async (_, res) => {
    try {
      const snapshot = await db.collection('saccos').get();
      const saccos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(saccos);
    } catch (err) {
      console.error('❌ Error fetching SACCOs:', err.message);
      res.status(500).json({ success: false, message: 'Failed to fetch saccos' });
    }
  });

  // 🔹 View all Matatus
  app.get('/admin/matatus', async (_, res) => {
    try {
      const snapshot = await db.collection('matatus').get();
      const matatus = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(matatus);
    } catch (err) {
      console.error('❌ Error fetching Matatus:', err.message);
      res.status(500).json({ success: false, message: 'Failed to fetch matatus' });
    }
  });
};
