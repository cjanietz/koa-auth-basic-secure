import { extractBasicAuthFromCtx } from '../extractBasicAuthFromCtx';
import * as request from 'supertest';
import * as Koa from 'koa';
import { Context } from 'koa';
import { MissingAuthenticationError } from '../../errors/MissingAuthenticationError';
import { InvalidAuthenticationError } from '../../errors/InvalidAuthenticationError';

it('should correctly extract username and password', async () => {
    const koa = new Koa();
    koa.use((ctx, next) => {
        const { username, password } = extractBasicAuthFromCtx(ctx);
        ctx.body = JSON.stringify({
            username,
            password
        });
    });
    const result = await request(koa.callback())
        .get('/')
        .auth('test', 'test');
    const resultBody = JSON.parse(result.text);
    expect(resultBody.username).toBe('test');
    expect(resultBody.password).toBe('test');
});

it('should handle invalid inputs properly', () => {
    const testFunc = (authHeader: string) =>
        extractBasicAuthFromCtx({
            headers: {
                authorization: authHeader
            }
        } as Context);

    const normalAuthHeader = `Basic ${Buffer.from('test:test').toString('base64')}`;
    const emptyHeader = '';
    const wrongAuthType = 'Bearer abcdefg';

    expect(testFunc(normalAuthHeader)).toMatchObject({ username: 'test', password: 'test' });
    expect(() => testFunc(emptyHeader)).toThrowError(MissingAuthenticationError);
    expect(() => testFunc(wrongAuthType)).toThrowError(InvalidAuthenticationError);
});
