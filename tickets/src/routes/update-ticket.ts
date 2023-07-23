import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket-schema';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@micro_tickets/common';
import mongoose from 'mongoose';
import { body } from 'express-validator';

const router = Router();

router.put('/api/update-ticket/:id', requireAuth,[
    body('title')
        .not() // it will check whether title is provided or not
        .isEmpty() // it will check whether provided title is empty or not
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be provided and greater than zero')
],validateRequest, async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(ticketId);
    if (false === isValidId) {
        throw new BadRequestError('given id is not valid');
    }
    const ticket = await Ticket.findById(ticketId);
    if( !ticket ){
        throw new NotFoundError('ticket not found');
    }
    console.log('from update ticket')
    console.log(ticket);
    console.log(req.currentUser)
    if( ticket.userId!==req.currentUser.id ){
        throw new NotAuthorizedError();
    }
    const {title,price} = req.body;
    ticket.set({title,price});
    await ticket.save();
    res.status(200).send({ticket});
});

export {router as updateTicketRouter}