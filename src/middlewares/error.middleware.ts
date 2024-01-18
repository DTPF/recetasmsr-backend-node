import { Request, Response, NextFunction } from "express";
import { responseKey } from "../core/responseKey";

const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ message: responseKey.unauthorized })
  }
  if (err.code === 'invalid_token') {
    return res.status(401).send({ message: responseKey.tokenExpired })
  }
  next()
}

export default errorMiddleware;