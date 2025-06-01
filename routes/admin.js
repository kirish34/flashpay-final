// Admin route handler// routes/admin.js

const fs = require('fs-extra');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

module.exports = function (app) {
  // Get all users (branches/cashiers/matatus)
  app.get('/admin/users', (_, res) => {
    res.json(global.users);
  });

  // Add new user
  app.post('/admin/add-user', (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    if (global.users.find(u => u.username === username)) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    const newUser = { username, password, role };
    global.users.push(newUser);
    fs.writeJson(usersFile, global.users, { spaces: 2 });

    res.json({ success: true, message: 'User added successfully' });
  });

  // Delete user
  app.post('/admin/delete-user', (req, res) => {
    const { username } = req.body;
    global.users = global.users.filter(u => u.username !== username);
    fs.writeJson(usersFile, global.users, { spaces: 2 });

    res.json({ success: true, message: 'User deleted' });
  });
};
