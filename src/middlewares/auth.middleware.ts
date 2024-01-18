import { NextFunction, Response } from "express";
import UserModel from "../core/user/models/user.model";
import { adminRole } from "../utils/constants";
import { responseKey, userKey } from "../core/responseKey";
import { RequestUser, User } from "../interfaces/user.interface";
import { ServerConfig } from "../config/config";
const config: ServerConfig = require('../config/config')
const { auth } = require('express-oauth2-jwt-bearer');

export const auth_0 = auth({
  audience: config.auth0.AUDIENCE,
  issuerBaseURL: config.auth0.ISSUER,
  tokenSigningAlg: 'RS256'
});

export const is_verified = async (req: RequestUser, res: Response, next: NextFunction) => {
  const findUser: User = await UserModel.findOne({ auth0Id: req.auth.payload.sub })
  if (!findUser) {
    return res.status(404).send({ message: userKey.notFound, key: 'is_verified' })
  }
  if (findUser.isVerified === false) {
    return res.status(401).send({ message: userKey.notVerified })
  }
  req.user = findUser
  next()
}

export const ensure_admin = async (req: RequestUser, res: Response, next: NextFunction) => {
  const findUser: User = await UserModel.findOne({ auth0Id: req.auth.payload.sub })
  if (!findUser) {
    return res.status(404).send({ message: userKey.notFound, key: 'ensure_admin' })
  }
  if (findUser.role !== adminRole) {
    return res.status(401).send({ message: responseKey.unauthorized })
  }
  if (findUser.isVerified === false) {
    return res.status(401).send({ message: userKey.notVerified })
  }
  req.user = findUser
  next()
}

export const hydrate = async (req: RequestUser, res: Response, next: NextFunction) => {
  const findUser: User = await UserModel.findOne({ auth0Id: req.auth.payload.sub })
  if (!findUser) {
    return res.status(404).send({ message: userKey.notFound, key: 'hydrate' })
  }
  req.user = findUser
  next()
}