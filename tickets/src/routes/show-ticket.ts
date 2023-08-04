import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket-schema';
import { BadRequestError, NotFoundError } from '@micro_tickets/common';
import mongoose from 'mongoose';

const router = Router();

router.get('/api/show-ticket/:id',async(req:Request,res:Response) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if( false===isValidId ){
        throw new BadRequestError('given id is not valid');
    }
    const ticket = await Ticket.findById(req.params.id);

    if( !ticket ) {
        throw new NotFoundError('given ticket id is not found');
    }
    res.status(200).send(ticket);
})

export {router as showTicketRouter}