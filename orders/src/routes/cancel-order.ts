import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { Order } from '../models/order-schema';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = Router()

router.put('/api/cancel-order/:orderId', requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const isValidId = mongoose.Types.ObjectId.isValid(orderId);
    if (false === isValidId) {
        throw new BadRequestError('given order id is not valid');
    }
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError('order with the given id is not found');
    }
    if (order.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save(); // here what will happen with ticket field we populated it above !!!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket,
        },
        version: order.version
    });
    res.status(200).send({ order });
});

export { router as cancelOrderRouter }