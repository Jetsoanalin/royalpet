let handler;

module.exports = async (event, context) => {
  if (!handler) {
    const serverless = require("serverless-http");
    const app = require("../server/src/app");
    handler = serverless(app, {
      binary: ["multipart/form-data", "image/*", "application/octet-stream"],
    });
  }
  return handler(event, context);
};
