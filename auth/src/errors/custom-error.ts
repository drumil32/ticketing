export abstract class CustomError extends Error {
    protected abstract statusCode: number;
    constructor(message: string){
        super(message);
    }
    public abstract serializeError():{message:string;field?:string}[];
    public abstract getStatusCode():number;
}