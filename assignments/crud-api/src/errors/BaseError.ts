export default class BaseError extends Error {
    public readonly code: number;
    public readonly isOperational: boolean;

    constructor( errorCode: string | number, message: string, isOperational: boolean = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = +errorCode;
        this.isOperational = isOperational;
        this.message = message;
        Error.captureStackTrace(this);
    }

    override get name() {
        return this.constructor.name;
    }

    stringify() {
        return JSON.stringify({...this, message: this.message, isOperational: undefined} )
    }
}
