export class HttpError extends Error {
    public readonly statusCode: number;
    public readonly sourceError: Error;

    constructor(statusCode: number, sourceError: Error) {
        super(sourceError.message);
        this.statusCode = statusCode;
        this.sourceError = sourceError;
    }
}
