// routes/login.js
const express = require('express');
const router = express.Router();
const session = require('express-session');
const path = require('path');
const fs = require('fs-extra');

// In-memory admin credentials only
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'flashpay123';

router.use(session({
  secret: 'flashpay-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 hours
}));

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check session status
router.get('/session', (req, res) => {
  if (req.session && req.session.admin) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Middleware to protect routes
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) next();
  else res.status(401).json({ message: 'Unauthorized' });
}

module.exports = (app) => {
  app.use('/api/auth', router);
  app.use('/api/admin', isAdmin); // Protect all /admin routes
};
