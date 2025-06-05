// routes/callback.js (Firebase version)
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = (app) => {
  app.post('/api/mpesa/callback', async (req, res) => {
    const body = req.body;
    const stkCallback = body.Body?.stkCallback;

    if (!stkCallback) return res.status(400).send('Invalid callback');

    const txId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    const status = resultCode === 0 ? 'Paid' : 'Failed';
    const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber')?.Value || null;
    const updatedAt = Date.now();

    try {
      await db.collection('pos_bills').doc(txId).set({
        status,
        updatedAt,
        mpesaReceipt
      }, { merge: true });

      console.log(`✅ M-PESA Callback received: ${txId} - ${status}`);
      res.sendStatus(200);
    } catch (error) {
      console.error('🔥 Callback DB error:', error);
      res.sendStatus(500);
    }
  });
};
