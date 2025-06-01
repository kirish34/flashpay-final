// routes/branches.js

const fs = require('fs-extra');
const path = require('path');

const filePath = path.join(__dirname, '../data/branches.json');

module.exports = function (app) {
  // Load or initialize
  if (!global.branches) {
    global.branches = fs.readJsonSync(filePath, { throws: false }) || [];
  }

  // Get all branches
  app.get('/admin/branches', (_, res) => {
    res.json(global.branches);
  });

  // Add new branch
  app.post('/admin/branches/add', (req, res) => {
    const { name, till } = req.body;
    if (!name || !till) return res.status(400).json({ success: false, message: 'Missing fields' });

    global.branches.push({ name, till });
    fs.writeJson(filePath, global.branches, { spaces: 2 });

    res.json({ success: true, message: 'Branch added' });
  });

  // Edit branch field
  app.post('/admin/branches/edit', (req, res) => {
    const { index, field, value } = req.body;
    if (global.branches[index]) {
      global.branches[index][field] = value;
      fs.writeJson(filePath, global.branches, { spaces: 2 });
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });

  // Delete branch
  app.post('/admin/branches/delete', (req, res) => {
    const { index } = req.body;
    if (global.branches[index]) {
      global.branches.splice(index, 1);
      fs.writeJson(filePath, global.branches, { spaces: 2 });
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  });
};
