// routes/cashiers.js

const fs = require('fs-extra');
const path = require('path');

const filePath = path.join(__dirname, '../data/cashiers.json');
const ussdPrefix = '*123*'; // your USSD base code

module.exports = function (app) {
  // Load initial data
  if (!global.cashiers) {
    global.cashiers = fs.readJsonSync(filePath, { throws: false }) || [];
  }

  // Get all cashiers
  app.get('/admin/cashiers', (_, res) => {
    res.json(global.cashiers);
  });

  // Add new cashier
  app.post('/admin/cashiers/add', (req, res) => {
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

    global.cashiers.push(newCashier);
    fs.writeJson(filePath, global.cashiers, { spaces: 2 });

    res.json({ success: true, cashier: newCashier });
  });

  // Delete cashier
  app.post('/admin/cashiers/delete', (req, res) => {
    const { index } = req.body;
    if (global.cashiers[index]) {
      global.cashiers.splice(index, 1);
      fs.writeJson(filePath, global.cashiers, { spaces: 2 });
      return res.json({ success: true });
    }
    res.status(404).json({ success: false });
  });

  function getBranchDigit(name) {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 9) + 1; // branch digit 1–9
  }
};
