import { Router, Request, Response } from 'express';
import { currentUser, requireAuth } from '../middlewares';

const router = Router();

router.get('/api/users/current-user', currentUser, (req: Request, res: Response) => {
    const temp = { currentUser: req.currentUser || null };
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };