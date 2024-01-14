import { registerLoginUser } from "../controllers/user.controller";
import { ensureAuth } from "../middlewares/auth.middleware";

const express = require('express');
// const UserController = require("../controllers/user.controller")
// import multipart from "connect-multiparty"
// const md_auth = require("../middlewares/auth.middleware");
// const md_upload_avatar = multipart({ uploadDir: "./src/uploads/avatar"})
const api = express.Router()

api.post("/login", [ensureAuth], registerLoginUser)

module.exports = api
