// TekeTeke route handler// routes/teketeke.js

const fs = require('fs-extra');
const path = require('path');

const teketekeFile = path.join(__dirname, '../data/teketeke_tx.json');

module.exports = function (app) {
  // Save fare payment
  app.post('/teketeke/pay', (req, res) => {
    const { matatu, amount } = req.body;

    const tx = {
      matatu,
      amount,
      date: new Date().toISOString(),
      status: 'paid',
    };

    global.teketekeTx.push(tx);
    fs.writeJson(teketekeFile, global.teketekeTx, { spaces: 2 });

    res.json({ success: true, message: 'Fare logged successfully' });
  });

  // Get all matatu payments
  app.get('/teketeke/payments', (req, res) => {
    res.json(global.teketekeTx);
  });

  // Summary for SACCO dashboard
  app.get('/teketeke/summary', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayTx = global.teketekeTx.filter(t => t.date.startsWith(today));
    
    const summary = {
      total: todayTx.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
      count: todayTx.length,
      byMatatu: {},
    };

    todayTx.forEach(tx => {
      if (!summary.byMatatu[tx.matatu]) summary.byMatatu[tx.matatu] = 0;
      summary.byMatatu[tx.matatu] += parseFloat(tx.amount);
    });

    res.json(summary);
  });
};
