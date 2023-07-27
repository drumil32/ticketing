import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order-schema';

const router = Router()

router.get('/api/show-order/:orderId', requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const isValidId = mongoose.Types.ObjectId.isValid(orderId);
    if (false === isValidId) {
        throw new BadRequestError('given order id is not valid');
    }
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError('order with the given id is not found');
    }
    if (order.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }
    res.status(200).send({ order });
});

export { router as showOrderRouter }