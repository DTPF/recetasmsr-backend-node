import { ServerConfig } from "./config/config";
const mongoose = require('mongoose');
const server = require("./server");
const config: ServerConfig = require('./config/config')

try {
  mongoose.connect(config.db.MONGO_URL)
  server.listen(config.app.PORT, async () => {
    console.log(`Running on ${config.app.URL}...`)
  })
} catch (error) {
  throw new Error()
}