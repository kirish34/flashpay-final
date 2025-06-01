// Callback route handler// routes/callback.js

module.exports = function (app) {
  app.post('/callback', (req, res) => {
    const body = req.body;
    const metadata = body?.Body?.stkCallback;

    console.log('📲 Callback received:', JSON.stringify(metadata));

    if (metadata?.ResultCode === 0) {
      const amount = metadata.CallbackMetadata.Item.find(i => i.Name === 'Amount')?.Value;
      const phone = metadata.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber')?.Value;

      // Match to active bill
      const txCode = Object.keys(global.activeBills).find(code => {
        const tx = global.activeBills[code];
        return tx && tx.amount == amount && tx.phone.endsWith(phone?.toString().slice(-6));
      });

      if (txCode && global.activeBills[txCode]) {
        global.activeBills[txCode].status = 'paid';
        console.log(`✅ TX ${txCode} marked as paid`);
      }
    }

    res.sendStatus(200);
  });
};
