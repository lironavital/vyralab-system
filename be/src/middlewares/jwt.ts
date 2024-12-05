import { NextFunction, Request, Response } from "express"

import jwt from 'jsonwebtoken'
import { getUserById } from "../db/postgres"
import { decodedTokenData, User } from "../types/global"
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || ""

// const map = new Map()

const signJWT = (data: object) => {
    const token = jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: '30d' })
    return token
}

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['vyralab_token']
        const user = jwt.verify(token, JWT_PRIVATE_KEY) as decodedTokenData;
        const userData = await getUserById(user.id) as User;
        req.userData = userData
        next()
    } catch (error) {
        res.sendStatus(401)
    }
}

export { signJWT, validateJWT, }