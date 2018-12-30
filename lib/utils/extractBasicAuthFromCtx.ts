import { Context } from 'koa';
import { InvalidAuthenticationError } from '../errors/InvalidAuthenticationError';
import { MissingAuthenticationError } from '../errors/MissingAuthenticationError';

export function extractBasicAuthFromCtx(ctx: Context) {
    const authHeader = ctx.headers.authorization;
    if (!authHeader) {
        throw new MissingAuthenticationError(new Error('Authorization Header is missing'));
    }
    let username;
    let password;
    try {
        const [, authInfo] = authHeader.split(/[Bb]asic /);
        [username, password] = Buffer.from(authInfo, 'base64')
            .toString()
            .split(':');
    } catch (err) {
        throw new InvalidAuthenticationError(err);
    }
    return {
        username,
        password,
        authHeader
    };
}
