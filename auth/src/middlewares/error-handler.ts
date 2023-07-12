import { Request, Response, NextFunction } from "express";
import { RequestValidationError, DatabaseConnectionError } from "../errors";
import { ValidationError } from "express-validator";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if( error instanceof CustomError ){
        return res.status(error.getStatusCode()).send({errors:error.serializeError()})
    }
    return res.status(400).send({
        errors : [{message:error.message}]
    });
};
