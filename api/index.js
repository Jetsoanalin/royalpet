const path = require("path");

// Resolve server dependencies when running as a Vercel serverless function
module.paths.unshift(path.join(__dirname, "..", "server", "node_modules"));

const serverless = require("serverless-http");
const app = require("../server/src/app");

module.exports = serverless(app);
