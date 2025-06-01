// routes/pos.js

module.exports = function (app) {
  // Create a new POS bill
  app.post('/pos/send-bill', (req, res) => {
    const { amount, phone, tillNumber } = req.body;

    if (!amount || !phone || !tillNumber) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const txCode = Math.floor(1000 + Math.random() * 9000).toString();

    global.activeBills = global.activeBills || {};
    global.activeBills[txCode] = {
      amount,
      phone,
      till: tillNumber,
      status: 'pending',
      createdAt: Date.now(),
    };

    console.log(`🧾 POS Bill: ${txCode} - KES ${amount} for ${phone}`);
    res.json({ success: true, txCode, message: 'Bill created, waiting for payment' });
  });

  // Check TX status
  app.get('/pos/check/:code', (req, res) => {
    const tx = global.activeBills[req.params.code];
    if (!tx) return res.status(404).json({ success: false, message: 'TX not found' });

    res.json({ success: true, status: tx.status || 'pending' });
  });
};
