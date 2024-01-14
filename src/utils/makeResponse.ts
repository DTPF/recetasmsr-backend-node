import { Request, Response, NextFunction } from "express";

export const makeResponse = (res: Response, code: number, msg: string, result: string | null, err: unknown) => {
	return res.status(code).send({ status: code, message: msg, result, error: err })
}

export const response500 = ({res, err}: {res: Response, err: unknown}) => {
	res.status(500).send({ message: 'Server error', error: err })
}

// module.exports = {
// 	makeResponse,
// 	response500
// }