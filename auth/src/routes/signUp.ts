import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors';
import { User } from '../models/userSchema';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken'

const router = Router();

router.post('/api/users/sign-up', [
    body('email')
        .isEmail()
        .withMessage('given email is not valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('given password is not valid')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new BadRequestError('email is already in exist');
    }
    const user = User.build({ email, password });
    const resp = await user.save();
    console.log(user)

    // generating JWT
    const userJWT = jwt.sign({
        id : user.id,
        email : user.email
    },process.env.JWT_SIGN!);

    // Store it on session object
    req.session = {
        jwt : userJWT
    }

    console.log(resp);
    res.status(200).send(resp);
});

export { router as signUpRouter };