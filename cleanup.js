function startBillCleanup(store, ttlMs, intervalMs = 60 * 1000) {
  return setInterval(() => {
    const now = Date.now();
    for (const [code, bill] of Object.entries(store)) {
      if (now - bill.createdAt > ttlMs) {
        delete store[code];
      }
    }
  }, intervalMs);
}

module.exports = { startBillCleanup };
