/** Vercel serverless handler — export Express app directly (not serverless-http / Lambda format) */
let app;

module.exports = (req, res) => {
  if (!app) {
    app = require("../server/src/app");
  }
  return app(req, res);
};
