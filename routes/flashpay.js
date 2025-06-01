// routes/flashpay.js

const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {
  // In-memory store for live bills
  global.activeBills = global.activeBills || {};

  // Cashier enters amount → link to USSD
  app.post('/flashpay/save', (req, res) => {
    const { cashierIndex, amount } = req.body;
    const cashier = global.cashiers?.[cashierIndex];

    if (!cashier) return res.status(404).json({ success: false, message: 'Cashier not found' });

    global.activeBills[cashier.ussdCode] = {
      amount,
      till: getBranchTill(cashier.branchName),
      status: 'waiting',
      createdAt: Date.now()
    };

    res.json({ success: true, ussdCode: cashier.ussdCode });
  });

  // Customer dials *123*2345# → this handles it
  app.post('/flashpay/confirm', (req, res) => {
    const { ussdCode, phone } = req.body;
    const bill = global.activeBills[ussdCode];

    if (!bill) return res.status(404).json({ success: false, message: 'No pending bill found' });

    // Simulate STK push here (you can insert your real Safaricom code instead)
    console.log(`📲 Initiating STK Push to ${phone} for KES ${bill.amount} → Till ${bill.till}`);

    bill.status = 'paid';
    bill.phone = phone;
    global.activeBills[ussdCode] = bill;

    res.json({ success: true, message: 'STK push simulated, marked as paid' });
  });

  // Show all active bills
  app.get('/flashpay/active', (_, res) => {
    const list = Object.entries(global.activeBills).map(([code, data]) => ({
      code,
      ...data
    }));
    res.json(list);
  });

  function getBranchTill(branchName) {
    const branch = global.branches.find(b => b.name === branchName);
    return branch ? branch.till : '0000000';
  }
};
