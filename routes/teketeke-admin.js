const fs = require('fs-extra');
const path = require('path');

const saccoFile = path.join(__dirname, '../data/saccos.json');
const matatuFile = path.join(__dirname, '../data/matatus.json');

module.exports = function (app) {
  // Initialize global arrays from file
  if (!global.saccos) {
    global.saccos = fs.readJsonSync(saccoFile, { throws: false }) || [];
  }
  if (!global.matatus) {
    global.matatus = fs.readJsonSync(matatuFile, { throws: false }) || [];
  }

  // 🔹 Register new SACCO
  app.post('/admin/register-sacco', async (req, res) => {
    const { name, contact, till, contractForm } = req.body;

    if (!name || !contact || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newSacco = { name, contact, till, contractForm };
    global.saccos.push(newSacco);

    try {
      await fs.writeJson(saccoFile, global.saccos, { spaces: 2 });
      console.log('✅ SACCO saved:', newSacco);
      res.json({ success: true, message: 'SACCO registered successfully' });
    } catch (err) {
      console.error('❌ Failed to save SACCO:', err.message);
      res.status(500).json({ success: false, message: 'Failed to save SACCO' });
    }
  });

  // 🔹 Register new Matatu
  app.post('/admin/register-matatu', async (req, res) => {
    const { owner, contact, vehicleType, plate, tlb, till } = req.body;

    if (!owner || !plate || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newMatatu = {
      owner,
      contact,
      vehicleType,
      plate,
      reg: plate, // match legacy reg field
      tlb,
      till,
      sacco: '' // empty for now
    };

    global.matatus.push(newMatatu);

    try {
      await fs.writeJson(matatuFile, global.matatus, { spaces: 2 });
      console.log('✅ Matatu saved:', newMatatu);
      res.json({ success: true, message: 'Matatu registered successfully' });
    } catch (err) {
      console.error('❌ Failed to save Matatu:', err.message);
      res.status(500).json({ success: false, message: 'Failed to save Matatu' });
    }
  });

  // 🔹 View all SACCOs
  app.get('/admin/saccos', (_, res) => {
    res.json(global.saccos || []);
  });

  // 🔹 View all Matatus
  app.get('/admin/matatus', (_, res) => {
    res.json(global.matatus || []);
  });
};
