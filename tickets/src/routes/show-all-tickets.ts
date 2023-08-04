import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket-schema';

const router = Router();

router.get('/api/show-all-tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined
    });

    res.status(200).send( tickets );
})

export { router as showAllTicketsRouter }