import { BadRequestError, requireAuth, validateRequest } from '@micro_tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket-schema';

const router = Router();

router.post('/api/create-ticket', requireAuth, [
    body('title')
        .not() // it will check whether title is provided or not
        .isEmpty() // it will check whether provided title is empty or not
        .withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be provided and greater than zero')
], validateRequest, async(req: Request, res: Response) => {
    const {title,price} = req.body;
    const {id:userId} = req.currentUser;
    // console.log(userId)
    const ticketExists = await Ticket.find({title});
    // console.log(ticketExists)
    // console.log(ticketExists.length)
    if( ticketExists.length ){
        throw new BadRequestError('ticket with this title already exists');
    }
    const ticket = Ticket.build({title,price,userId});
    await ticket.save();
    // console.log(ticket);
    res.status(201).send({ticket});
});

export { router as createTicketRouter }