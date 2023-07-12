import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    protected statusCode = 400;
    public getStatusCode(): number {
        return this.statusCode;
    }
    constructor(private error:string){
        super('BadRequestError is occured');
    }
    public serializeError():{message:string;field?:string}[]{
        return[
            {message:this.error}
        ]
    }
}