import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        return next();
    }
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SIGN!) as UserPayload;
        req.currentUser = payload;
    } catch (error) {
        console.log(error);
        throw new BadRequestError('token is changed!!!!!');
    }
    next();
}