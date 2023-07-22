import { Router, Request, Response } from 'express';
import { currentUser } from '@micro_tickets/common';

const router = Router();

router.get('/api/users/current-user', currentUser, (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };