// routes/status.js (Firebase version)
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = (app) => {
  app.get('/api/cashier/status/:txId', async (req, res) => {
    const txId = req.params.txId;
    try {
      const doc = await db.collection('pos_bills').doc(txId).get();
      if (!doc.exists) {
        return res.status(404).json({ status: 'Not Found', final: false });
      }

      const data = doc.data();
      const finalStatuses = ['Paid', 'Failed'];
      const isFinal = finalStatuses.includes(data.status);

      res.json({
        status: data.status || 'Pending',
        final: isFinal,
        phone: data.phone || '',
        receipt: data.mpesaReceipt || '',
        updatedAt: data.updatedAt || '',
      });
    } catch (error) {
      console.error('Status fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch status' });
    }
  });
};
