const queryStore = require('../utils/queryStore');

module.exports = (req, res, next) => {
  const store = { queryCount: 0, start: process.hrtime.bigint() };
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (body && body.success === true) {
      const durationMs = Number(process.hrtime.bigint() - store.start) / 1e6;
      body.meta = { queryCount: store.queryCount, durationMs: Math.round(durationMs) };
    }
    return originalJson(body);
  };

  queryStore.run(store, next);
};
