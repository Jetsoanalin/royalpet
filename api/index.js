const serverless = require("serverless-http");
const app = require("../server/src/app");

module.exports = serverless(app, {
  binary: ["multipart/form-data", "image/*", "application/octet-stream"],
});
