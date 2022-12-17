export default class BaseError extends Error {
    public readonly code: string | number;
    public readonly isOperational: boolean;

    constructor( errorCode: string | number, message: string, isOperational: boolean = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = errorCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }

    override get name() {
        return this.constructor.name;
    }
}
