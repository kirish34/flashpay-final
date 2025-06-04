const { test } = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'test';
const app = require('../server');

function startServer() {
  const server = app.listen(0);
  const url = `http://localhost:${server.address().port}`;
  return { server, url };
}

test('saves bill and returns USSD code', async () => {
  global.activeBills = {};

  const { server, url } = startServer();

  const res = await fetch(`${url}/flashpay/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cashierIndex: 0, amount: 150 })
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.ussdCode);
  assert.ok(global.activeBills[body.ussdCode]);
  assert.equal(global.activeBills[body.ussdCode].amount, 150);

  server.close();
});
