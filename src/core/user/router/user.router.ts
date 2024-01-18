import { ensure_admin, auth_0, is_verified, hydrate } from "../../../middlewares";
import * as controller from "../controllers/user.controller";
import multipart from "connect-multiparty"
const express = require('express');
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" })
const api = express.Router()

api.
  post("/login", [auth_0], controller.registerLoginUser).
  patch("/update-user", [auth_0, is_verified], controller.updateUser).
  delete("/delete-user", [auth_0, hydrate], controller.deleteUserSelf).
  delete("/delete-user-admin/:userId", [auth_0, ensure_admin], controller.deleteUserAdmin).
  post("/update-user-avatar", [auth_0, md_upload_avatar, is_verified], controller.updateUserAvatar).
  get("/get-users", [auth_0, ensure_admin], controller.getUsers).
  patch("/update-role", [auth_0, ensure_admin], controller.updateRole)

module.exports = api
