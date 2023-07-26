import { BadRequestError, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';

const router = Router()

router.post('/api/show-all-order', requireAuth, [], validateRequest, async(req: Request, res: Response) => {
    res.send();
});

export { router as showAllOrdersRouter }