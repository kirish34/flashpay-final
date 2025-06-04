// routes/login.js

const path = require('path');
const crypto = require('crypto');

module.exports = function (app) {
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = global.users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const hashed = crypto.scryptSync(password, user.salt, 64).toString('hex');
    if (hashed !== user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, role: user.role, redirect: getRedirect(user.role) });
  });

  function getRedirect(role) {
    switch (role) {
      case 'admin': return '/admin.html';
      case 'sacco': return '/sacco-dashboard.html';
      case 'matatu': return '/matatu-dashboard.html';
      default: return '/';
    }
  }
};
