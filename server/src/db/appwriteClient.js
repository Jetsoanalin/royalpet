const { Client, Databases, Storage, ID, Query } = require("node-appwrite");
const env = require("../config/env");

let client = null;
let databases = null;
let storage = null;

const getClient = () => {
  if (client) return client;
  if (!env.APPWRITE_ENDPOINT || !env.APPWRITE_PROJECT_ID || !env.APPWRITE_API_KEY) {
    throw new Error(
      "Appwrite is not configured. Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY."
    );
  }
  client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);
  return client;
};

const getDatabases = () => {
  if (!databases) databases = new Databases(getClient());
  return databases;
};

const getStorage = () => {
  if (!storage) storage = new Storage(getClient());
  return storage;
};

module.exports = {
  getClient,
  getDatabases,
  getStorage,
  ID,
  Query,
};
