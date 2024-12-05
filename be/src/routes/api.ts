import express, { Request, Response, Router } from "express";
const app: Router = express.Router()

app.get('/', (req: Request, res: Response): void => {
    res.sendStatus(200)
})

module.exports = app