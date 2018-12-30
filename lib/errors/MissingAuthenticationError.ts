import { HttpError } from './HttpError';

export class MissingAuthenticationError extends HttpError {
    constructor(sourceError: Error) {
        super(401, sourceError);
    }
}
