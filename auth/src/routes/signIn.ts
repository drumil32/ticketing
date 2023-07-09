
import {Router} from 'express';

const router = Router();

router.post('/api/users/sign-in',(req,res) => {
    res.send('hi')
});

export { router as signInRouter };