import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket-schema';
import { Order } from '../models/order-schema';

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
    if( isReversed ){
        throw new BadRequestError('Ticket is already reversed');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+Number(process.env.EXPIRATION_WINDOW_SECONDS));

    const order = Order.build({
        userId : req.currentUser.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();
    res.status(201).send({order});
});

export { router as createOrderRouter }