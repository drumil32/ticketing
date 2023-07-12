import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    protected statusCode = 401;
    constructor(){
        super('Authorization error is occured!');
    }
    public getStatusCode(): number {
        return this.statusCode;
    }
    public serializeError(): { message: string; field?: string | undefined; }[] {
        return [
            {message:'Not Authorized'}
        ]
    }
}