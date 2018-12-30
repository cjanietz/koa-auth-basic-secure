import { HttpError } from './HttpError';

export class InvalidAuthenticationError extends HttpError {
    constructor(sourceError: Error) {
        super(403, sourceError);
    }
}
