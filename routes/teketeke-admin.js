// routes/teketeke-admin.js

const fs = require('fs-extra');
const path = require('path');

const saccoFile = path.join(__dirname, '../data/saccos.json');
const matatuFile = path.join(__dirname, '../data/matatus.json');

module.exports = function (app) {
  // Load existing data or initialize empty arrays
  if (!global.saccos) global.saccos = fs.readJsonSync(saccoFile, { throws: false }) || [];
  if (!global.matatus) global.matatus = fs.readJsonSync(matatuFile, { throws: false }) || [];

  // Register new SACCO
  app.post('/admin/register-sacco', (req, res) => {
    const { name, contact, till, contractForm } = req.body;
    if (!name || !contact || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    global.saccos.push({ name, contact, till, contractForm });
    fs.writeJson(saccoFile, global.saccos, { spaces: 2 });
    res.json({ success: true, message: 'SACCO registered successfully' });
  });

  // Register new Matatu
  app.post('/admin/register-matatu', (req, res) => {
    const { owner, contact, vehicleType, plate, tlb, till } = req.body;
    if (!owner || !plate || !till) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    global.matatus.push({ owner, contact, vehicleType, plate, tlb, till });
    fs.writeJson(matatuFile, global.matatus, { spaces: 2 });
    res.json({ success: true, message: 'Matatu registered successfully' });
  });

  // Optional: View registered SACCOs
  app.get('/admin/saccos', (_, res) => {
    res.json(global.saccos || []);
  });

  // Optional: View registered matatus
  app.get('/admin/matatus', (_, res) => {
    res.json(global.matatus || []);
  });
};
