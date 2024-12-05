import { Router, Request, Response } from 'express';
const router = Router();

// Example route for OAuth
router.get('/login', (req: Request, res: Response) => {
    res.send('OAuth Login Route');
});

router.get('/callback', (req: Request, res: Response) => {
    res.send('OAuth Callback Route');
});

export default router;
