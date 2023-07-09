import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    protected statusCode = 404;
    constructor(){
        super('NotFoundError is occured');
    }
    public serializeError(){
        return [{message:'Route Not Found'}]
    }
    public getStatusCode(){
        return this.statusCode;
    }
}