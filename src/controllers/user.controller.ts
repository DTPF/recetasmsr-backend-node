import { Request, Response } from "express";
import User from "../models/user.model";
import { makeResponse, response500 } from "../utils/makeResponse";

// const User = require("../models/user.model")
// const { response500, makeResponse } = require('../utils/makeResponse')

export async function registerLoginUser(req: Request | any, res: Response) {
  const { user } = req.body
  // console.log(user);
  
  if (!user) {
		return res.status(404).send({ message: 'User is required' })
	}
  
	try {
		const userStored = await User.findOne({ userId: user.sub.toString() }).lean().exec()
		if (!userStored) {
			const newUser = new User({
				userId: user.sub,
				name: user.given_name || user.nickname,
				lastname: user.family_name || '',
				nickname: user.nickname || user.given_name,
				email: user.email,
				avatar: user.picture || '',
				language: user.locale || 'es',
        role: 'user',
        isVerified: user.email_verified,
			})
			try {
				const userSaved = await newUser.save()
				userSaved.__v = undefined
				// console.log(userSaved);
				
        return res.status(200).send({ message: 'User created successful', user: userSaved })
			} catch (err: any) {
				if (err.code === 11000) {
          return res.status(501).send({ message: 'Email exists', error: err })
				}
        return res.status(500).send({ message: 'Server error', error: err })
			}
		} else {
			delete userStored.__v
				// console.log(userStored);
      return res.status(201).send({ user: userStored })
		}
	} catch (err) {
		return res.status(500).send({ message: 'Server error', error: err })
	}
}