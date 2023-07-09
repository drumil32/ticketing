import {ValidationError} from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError{
    protected statusCode = 400;
    constructor(public errors: ValidationError[]){
        super('RequestValidationError is occurred');
    }
    serializeError(){
        var formattedErrors = this.errors.map((error: ValidationError) => {
            if (error.type === "field") {
                return { message: error.msg, field: error.path };
            }else{
                return { message: error.msg}
            }
        });
        return formattedErrors;
    }
    public getStatusCode(): number {
        return this.statusCode;
    }
}