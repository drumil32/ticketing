import { Router, Request, Response } from 'express';

const router = Router();

router.post('/api/tickets', (req: Request, res: Response) => {
    res.sendStatus(200);
});

export { router as createTicketRouter }