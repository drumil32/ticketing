import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user-schema';
import { validateRequest,BadRequestError } from '@micro_tickets/common';
import { Password } from '../service/password';
import jwt from 'jsonwebtoken';
import { Session } from 'express-session';

interface CustomSession extends Session {
  jwt: string;
}

const router = Router();

router.post('/api/users/sign-in', [
    body('email')
        .isEmail()
        .withMessage('given email is not valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('given password is not valid')
], validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        console.log('we are inside sign-in')
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('invalid credentials');
        }
        const passwordIsMatch = await Password.compare(password,existingUser.password);
        if( !passwordIsMatch )
            throw new BadRequestError('invalid credentials');

        // generating JWT
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_SIGN!);

        // Store it on session object
        // req.session = {
        //     jwt: userJWT
        // }as CustomSession
        console.log(existingUser)
        res.status(200).send({user:existingUser,token:userJWT});
    });

export { router as signInRouter };