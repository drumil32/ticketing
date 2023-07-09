import {Router,Request,Response} from 'express';
import { body,validationResult } from 'express-validator';
import { RequestValidationError,DatabaseConnectionError } from '../errors';

const router = Router();

router.post('/api/users/sign-up',[
    body('email')
        .isEmail()
        .withMessage('given email is not valid'),
    body('password')
        .trim()
        .isLength({min:4,max:20})
        .withMessage('given password is not valid')
],async(req:Request, res:Response) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        throw new RequestValidationError(errors.array());
    }
    const {email, password} = req.body;
    console.log(email, password);
    throw new DatabaseConnectionError();
    res.send('we are creating user');
});

export { router as signUpRouter };