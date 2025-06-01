// Dashboard file routes// routes/dashboard.js

const path = require('path');

module.exports = function (app) {
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.get('/login', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  });

  app.get('/admin.html', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
  });

  app.get('/sacco-dashboard.html', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/sacco-dashboard.html'));
  });

  app.get('/matatu-dashboard.html', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/matatu-dashboard.html'));
  });

  app.get('/pos.html', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/pos.html'));
  });

  app.get('/ussd-simulator.html', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/ussd-simulator.html'));
  });
};
