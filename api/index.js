const path = require("path");

// Resolve server dependencies when running as a Vercel serverless function
module.paths.unshift(path.join(__dirname, "..", "server", "node_modules"));

// Export the Express app directly — Vercel's Node runtime wraps it (no serverless-http)
module.exports = require("../server/src/app");
