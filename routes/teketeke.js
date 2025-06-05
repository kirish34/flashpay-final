// routes/teketeke.js (Firebase version)
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = function (app) {
  // Save fare payment
  app.post('/teketeke/pay', async (req, res) => {
    const { matatu, amount } = req.body;

    const tx = {
      matatu,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      status: 'paid'
    };

    try {
      await db.collection('teketeke_tx').add(tx);
      res.json({ success: true, message: 'Fare logged successfully' });
    } catch (err) {
      console.error('🔥 Error saving fare:', err);
      res.status(500).json({ success: false, message: 'Failed to save payment' });
    }
  });

  // Get all matatu payments
  app.get('/teketeke/payments', async (req, res) => {
    try {
      const snapshot = await db.collection('teketeke_tx').get();
      const payments = snapshot.docs.map(doc => doc.data());
      res.json(payments);
    } catch (err) {
      console.error('🔥 Error fetching payments:', err);
      res.status(500).json({ success: false });
    }
  });

  // Summary for SACCO dashboard
  app.get('/teketeke/summary', async (req, res) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const snapshot = await db.collection('teketeke_tx').get();
      const todayTx = snapshot.docs
        .map(doc => doc.data())
        .filter(tx => tx.date.startsWith(today));

      const summary = {
        total: todayTx.reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
        count: todayTx.length,
        byMatatu: {}
      };

      todayTx.forEach(tx => {
        if (!summary.byMatatu[tx.matatu]) summary.byMatatu[tx.matatu] = 0;
        summary.byMatatu[tx.matatu] += parseFloat(tx.amount);
      });

      res.json(summary);
    } catch (err) {
      console.error('🔥 Error building summary:', err);
      res.status(500).json({ success: false });
    }
  });
};
