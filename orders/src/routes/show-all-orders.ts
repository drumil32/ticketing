import { BadRequestError, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/order-schema';

const router = Router()

router.get('/api/show-all-order', requireAuth, async(req: Request, res: Response) => {
    const orders = await Order.find({userId:req.currentUser.id}).populate('ticket');
    return res.status(200).send({orders});
});

export { router as showAllOrdersRouter }