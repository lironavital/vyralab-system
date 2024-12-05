import { Router, Request, Response } from 'express';
const app = Router();
import { getUserByEmailAndPassword } from '../db/postgres';
import { signJWT } from '../middlewares/jwt';
import { User } from '../types/global';

app.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send({ message: 'Invalid input' });
        }

        const registeredUser = await getUserByEmailAndPassword({ email, password }) as User;

        if (registeredUser) {
            const token = signJWT({ id: registeredUser.id, firstName: registeredUser.firstname, lastName: registeredUser.lastname })

            res.cookie("vyralab_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only set "secure" to true in production
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration (e.g., 24 hours)
            });

            res.status(200).send("User is logged in!");
        }
        else {
            res.sendStatus(401)
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
})

app.get('/status', async (req: Request, res: Response) => {
    if (req.cookies['vyralab_token']) {
        res.sendStatus(200)
    }
    else {
        res.sendStatus(401)
    }
})

app.delete('/', async (req: Request, res: Response) => {
    if (req.cookies['vyralab_token']) {
        res.clearCookie('vyralab_token')
        res.sendStatus(200)
    }
    else {
        res.sendStatus(401)
    }
})

export default app 