
import {Router} from 'express';
import { Session } from 'express-session';

const router = Router();

router.post('/api/users/sign-out',(req,res) => {
    req.session = null as unknown as Session;
    res.send({});
});

export { router as signOutRouter };