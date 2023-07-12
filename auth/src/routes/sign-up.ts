import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user-schema';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = Router();

router.post('/api/users/sign-up', [
    body('email')
        .isEmail()
        .withMessage('given email is not valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('given password is not valid')
], validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            throw new BadRequestError('email is already in exist');
        }
        const user = User.build({ email, password });
        const resp = await user.save();

        // generating JWT
        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SIGN!);

        // Store it on session object
        req.session = {
            jwt: userJWT
        }

        res.status(201).send(resp);
    });

export { router as signUpRouter };