const { test } = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'test';
const app = require('../server');

function startServer() {
  const server = app.listen(0);
  const url = `http://localhost:${server.address().port}`;
  return { server, url };
}

test('logs in with valid credentials', async () => {
  const { server, url } = startServer();

  const res = await fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.role, 'admin');

  server.close();
});

test('rejects invalid credentials', async () => {
  const { server, url } = startServer();

  const res = await fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'foo', password: 'bar' })
  });

  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.success, false);

  server.close();
});
