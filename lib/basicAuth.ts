import * as yup from 'yup';
import { Context, Middleware } from 'koa';
import { extractBasicAuthFromCtx } from './utils/extractBasicAuthFromCtx';
import { MissingAuthenticationError } from './errors/MissingAuthenticationError';
import { UsernamePasswordCombination } from './model/UsernamePasswordCombination';
import { Cache } from './model/Cache';
import { isPasswordService, PasswordService } from './model/PasswordService';
import { HmacPasswordService } from './provider/HmacPasswordService';
import { InvalidAuthenticationError } from './errors/InvalidAuthenticationError';

export interface BasicAuthConfiguration {
    credentials: UsernamePasswordCombination[];
    passwordProtection: PasswordService | string;
    customRealm?: string;
    cache?: Cache;
}

const basicAuthConfigValidator = yup.object<BasicAuthConfiguration>({
    credentials: yup
        .array(
            yup.object({
                username: yup.string().required(),
                password: yup.string().required()
            })
        )
        .required(),
    passwordProtection: yup
        .mixed()
        .test({
            name: 'Type Test',
            test: value => typeof value === 'string' || isPasswordService(value)
        })
        .required(),
    customRealm: yup.string(),
    cache: yup.mixed()
});

export function basicAuth(config: BasicAuthConfiguration): Middleware {
    basicAuthConfigValidator.validateSync(config);
    const { credentials, cache, passwordProtection, customRealm } = config;
    const effectivePasswordService =
        typeof passwordProtection === 'string'
            ? new HmacPasswordService({ secret: passwordProtection })
            : passwordProtection;

    return async (ctx: Context, next: () => Promise<void>) => {
        try {
            const { username, password } = extractBasicAuthFromCtx(ctx);
            if (cache && cache.get(username) === password) {
                // We have seen this combination before properly authenticated so let it through
                return await next();
            }

            const userEntry = credentials.find(e => e.username === username);
            if (!userEntry) {
                throw new InvalidAuthenticationError(new Error('User was not found'));
            }

            const isValidPassword = await effectivePasswordService.compare(
                password,
                userEntry.password
            );
            if (!isValidPassword) {
                throw new InvalidAuthenticationError(new Error('Invalid password'));
            } else if (cache) {
                cache.set(username, password);
            }
        } catch (err) {
            if (
                err instanceof MissingAuthenticationError ||
                err instanceof InvalidAuthenticationError
            ) {
                // Inform the browser to retry the authentication
                ctx.status = 401;
                ctx.set('WWW-Authenticate', `Basic realm=${customRealm || 'Authentication'}`);
                return;
            } else {
                // If the error has not been thrown by anything from this middleware => Propagate it upwards
                throw err;
            }
        }
        await next();
    };
}
