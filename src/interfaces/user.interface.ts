import { Request } from "express";

export interface User {
  _id: string;
  auth0Id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Auth0User {
  nickname: string
  name: string
  picture: string
  updated_at: string
  email: string
  email_verified: boolean
  sub: string
  locale: string
}

export interface RequestUser extends Request {
  user: User
  auth: Auth0Request
}

interface Auth0Request {
  payload: {
    iss: string,
    sub: string,
    aud: string[],
    iat: number,
    exp: number,
    azp: string,
    scope: string
  },
  header: { alg: string, typ: string, kid: string },
  token: string
}