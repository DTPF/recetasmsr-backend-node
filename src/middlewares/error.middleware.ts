import { Request, Response, NextFunction } from "express";

const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ status: 401, message: 'No estás autorizado' })
  }

  if (err.code === 'invalid_token') {
    return res.status(401).send({ status: 401, message: 'El token ha expirado' })
  }
}

export default errorMiddleware;