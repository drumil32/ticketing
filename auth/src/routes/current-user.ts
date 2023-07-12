import { Router, Request, Response } from 'express';
import { currentUser, requireAuth } from '../middlewares';

const router = Router();

router.get('/api/users/currentUser', currentUser,requireAuth, (req: Request, res: Response) => {
    console.log('inside currentUser router!!')
    res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };