import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket-schema';
import { Order, OrderStatus } from '../models/order-schema';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = Router()

router.post('/api/create-order', [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('ticketId must be provided')
], validateRequest, requireAuth, async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const isValidId = mongoose.Types.ObjectId.isValid(ticketId);
    if (false === isValidId) {
        throw new BadRequestError('given ticket id is not valid');
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError('ticket with the given id is not found');
    }

    // we are checking whether the ticket is reversed or not
    const isReversed = await ticket.isReversed();
    if (isReversed) {
        throw new BadRequestError('Ticket is already reversed');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + Number(process.env.EXPIRATION_WINDOW_SECONDS));
    console.log(expiration)
    console.log(process.env.EXPIRATION_WINDOW_SECONDS)
    const order = Order.build({
        userId: req.currentUser.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket:ticket.id
    });
    console.log(order)
    console.log(order.expiresAt)
    await order.save();
    console.log('order is going to be published')
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        expiresAt: order.expiresAt.toISOString(),
        ticket:{
            id: ticket.id,
            price: ticket.price
        },
        userId: order.userId,
        version: order.version
    });
    res.status(201).send({ order });
});

export { router as createOrderRouter }