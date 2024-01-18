import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { userRole, adminRole, creatorRole } from "../../../utils/constants";
import { responseKey, userKey } from "../../responseKey";
import { Auth0User, RequestUser, User } from "../../../interfaces/user.interface";

export async function registerLoginUser(req: RequestUser, res: Response) {
	const { user }: { user: Auth0User } = req.body
	if (!user) {
		return res.status(404).send({ message: userKey.required })
	}
	let userStored;
	try {
		userStored = await UserModel.findOne({ auth0Id: user.sub.toString() }).lean().exec()
		if (userStored) {
			delete userStored.__v
			return res.status(201).send({ user: userStored })
		} else {
			const newUser = new UserModel({
				auth0Id: user.sub,
				name: '',
				lastname: '',
				nickname: '',
				email: user.email,
				avatar: user.picture ?? '',
				language: user.locale ?? 'es',
				role: userRole,
				isVerified: user.email_verified,
			})
			try {
				const userSaved = await newUser.save()
				userSaved.__v = undefined
				return res.status(200).send({ message: userKey.createdSuccess, user: userSaved })
			} catch (err: any) {
				if (err.code === 11000) {
					return res.status(500).send({ message: userKey.repeatedEmail, error: err })
				}
				return res.status(500).send({ message: responseKey.serverError, error: err })
			}
		}
	} catch (err) {
		return res.status(500).send({ message: responseKey.serverError, error: err })
	} finally {
		if (user.sub && userStored?.isVerified === false && user.email_verified === true) {
			await UserModel.findOneAndUpdate({ auth0Id: user.sub }, { isVerified: user.email_verified }, { new: true }).lean().exec()
		}
	}
}

export async function updateUser(req: RequestUser, res: Response) {
	if (!req.body.name && !req.body.lastname && !req.body.nickname && !req.body.language) {
		return res.status(404).send({ message: userKey.required })
	}
	try {
		const userUpdated = await UserModel.findOneAndUpdate({ auth0Id: req.user.auth0Id }, req.body, { new: true }).lean().exec()
		if (!userUpdated) {
			return res.status(404).send({ message: userKey.notFound })
		}
		delete userUpdated.__v
		return res.status(200).send({ user: userUpdated })
	} catch (err) {
		return res.status(500).send({ message: responseKey.serverError, error: err })
	}
}

export async function deleteUserSelf(req: RequestUser, res: Response) {
	try {
		const userDeleted = await UserModel.findOneAndDelete({ auth0Id: req.auth.payload.sub }).lean().exec()
		if (!userDeleted) {
			return res.status(404).send({ message: userKey.notFound })
		}
		delete userDeleted.__v
		return res.status(200).send({ message: userKey.deletedSuccess, user: userDeleted })
	} catch (err) {
		return res.status(500).send({ message: responseKey.serverError, error: err })
	}
}

export async function deleteUserAdmin(req: RequestUser, res: Response) {
	const { userId } = req.params
	// Only admin can delete user
	if (req.user.role !== adminRole) {
		return res.status(403).send({ message: responseKey.unauthorized })
	}
	const findUser = await UserModel.findOne({ auth0Id: userId })
	// Search user
	if (!findUser) {
		return res.status(404).send({ message: userKey.notFound })
	}
	// Only can delete userRole or creatorRole
	if (findUser?.role === adminRole) {
		return res.status(403).send({ message: responseKey.notAllowed })
	}
	try {
		const userDeleted = await UserModel.findOneAndDelete({ auth0Id: userId }).lean().exec()
		if (!userDeleted) {
			return res.status(404).send({ message: userKey.notFound })
		}
		delete userDeleted.__v
		return res.status(200).send({ message: userKey.deletedSuccess })
	} catch (err) {
		return res.status(500).send({ message: responseKey.serverError, error: err })
	}
}

export async function updateRole(req: RequestUser, res: Response) {
	const { user } = req.body
	if (!user) {
		return res.status(404).send({ message: userKey.required })
	}
	// Only userRole and creatorRole can be updated
	if (user.role !== userRole) {
		if (user.role !== creatorRole) {
			return res.status(404).send({ message: responseKey.roleNotAllowed })
		}
	}
	// Only admin can update role
	if (req.user.role !== adminRole) {
		return res.status(403).send({ message: responseKey.unauthorized })
	}
	const findUser = await UserModel.findOne({ auth0Id: user.sub })
	// Search user
	if (!findUser) {
		return res.status(404).send({ message: userKey.notFound })
	}
	// Only can update role to userRole or creatorRole
	if (findUser.role === adminRole) {
		return res.status(403).send({ message: responseKey.notAllowed })
	}
	try {
		const userUpdated = await UserModel.findOneAndUpdate({ auth0Id: user.sub }, { role: user.role }, { new: true }).lean().exec()
		if (!userUpdated) {
			return res.status(404).send({ message: userKey.notFound })
		}
		delete userUpdated.__v
		return res.status(200).send({ user: userUpdated })
	} catch (err) {
		return res.status(500).send({ message: responseKey.serverError, error: err })
	}
}

export async function getUsers(req: RequestUser, res: Response) {
	try {
		const users = await UserModel.find().lean().exec()
		users.forEach((user: any) => {
			delete user.__v
		})
		return res.status(200).send({ users })
	} catch (err) {
		return res.status(500).send({ message: responseKey.serverError, error: err })
	}
}

export async function updateUserAvatar(req: Request, res: Response) { }