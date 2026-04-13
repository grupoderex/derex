const { memoryStore } = require("cache-manager");

const memoryCache = memoryStore({
  max: 100,
  ttl: 2 * 24 * 60 * 60 * 1000, // 2 days - note max 32 bit integer
});

module.exports = {
  memoryCache,
};
