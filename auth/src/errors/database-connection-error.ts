import { CustomError } from "./custom-error";
export class DatabaseConnectionError extends CustomError{
    public reason = "Error while connecting to database";
    protected statusCode = 500;
    constructor(){
        super('DatabaseConnectionError is occured');
    }
    serializeError(){
        return[
            {message:this.reason}
        ]
    }
    public getStatusCode(): number {
        return this.statusCode;
    }
}