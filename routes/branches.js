// routes/branches.js (Firebase version)
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = function (app) {
  // Get all branches
  app.get('/admin/branches', async (_, res) => {
    try {
      const snapshot = await db.collection('branches').get();
      const branches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(branches);
    } catch (err) {
      console.error('🔥 Error fetching branches:', err);
      res.status(500).json({ success: false });
    }
  });

  // Add new branch
  app.post('/admin/branches/add', async (req, res) => {
    const { name, till } = req.body;
    if (!name || !till) return res.status(400).json({ success: false, message: 'Missing fields' });

    try {
      await db.collection('branches').add({ name, till });
      res.json({ success: true, message: 'Branch added' });
    } catch (err) {
      console.error('🔥 Error adding branch:', err);
      res.status(500).json({ success: false });
    }
  });

  // Edit branch
  app.post('/admin/branches/edit', async (req, res) => {
    const { id, field, value } = req.body;
    if (!id || !field || !value) return res.status(400).json({ success: false, message: 'Missing fields' });

    try {
      await db.collection('branches').doc(id).update({ [field]: value });
      res.json({ success: true });
    } catch (err) {
      console.error('🔥 Error editing branch:', err);
      res.status(500).json({ success: false });
    }
  });

  // Delete branch
  app.post('/admin/branches/delete', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });

    try {
      await db.collection('branches').doc(id).delete();
      res.json({ success: true });
    } catch (err) {
      console.error('🔥 Error deleting branch:', err);
      res.status(500).json({ success: false });
    }
  });
};
