import {Router,Request,Response} from 'express';

const router = Router();

router.get('/api/users/currentUser',(req:Request, res:Response) => {
    res.send('how are you')
});

export { router as currentUserRouter };