import each from 'jest-each';
import * as Koa from 'koa';
import * as request from 'supertest';
import { basicAuth, BasicAuthConfiguration } from '../basicAuth';
import { BCryptPasswordService, HmacPasswordService } from '..';
import { UnsecurePasswordService } from '../provider/UnsecurePasswordService';
import { SimpleObjectCache } from '../provider/SimpleObjectCache';

each([
    [
        {
            credentials: [
                { username: 'test', password: 'rjRQpXztmEP9/BTu5S366Pzg9aTQBarV1Kzmm2dNNa4=' }
            ],
            passwordProtection: 'test'
        }
    ],
    [
        {
            credentials: [
                { username: 'test', password: 'rjRQpXztmEP9/BTu5S366Pzg9aTQBarV1Kzmm2dNNa4=' },
                { username: 'test2', password: 'rjRQpXztmEP9/BTu5S366Pzg9aTQBarV1Kzmm2dNNa4=' }
            ],
            passwordProtection: new HmacPasswordService({ secret: 'test' })
        }
    ],
    [
        {
            credentials: [
                {
                    username: 'test',
                    password: '$2b$10$u15qtrw5K.gJMDMVOA8GWuFKMrW2hErt6MJBcHmZLt5QRU8OnoGgi'
                }
            ],
            passwordProtection: new BCryptPasswordService()
        }
    ],
    [
        {
            credentials: [{ username: 'test', password: 'test2' }],
            passwordProtection: new UnsecurePasswordService()
        }
    ],
    [
        {
            credentials: [
                {
                    username: 'test',
                    password: '$2b$04$sudfdtAWQDhOtT9K.FdXLe51eydOk.OTUNLCgi4sZL927fst3XOuu'
                }
            ],
            passwordProtection: new BCryptPasswordService(),
            cache: new SimpleObjectCache()
        }
    ]
] as Array<BasicAuthConfiguration>[]).describe('simple tests with default hmac', authConfig => {
    let app: Koa;
    beforeEach(() => {
        app = new Koa();
        app.use(basicAuth(authConfig));
        app.use(async (ctx: Koa.Context) => {
            ctx.body = 'Hello World';
        });
    });

    it('should be denying authentication with no credentials', async () => {
        await request(app.callback())
            .get('/')
            .expect(401);
    });

    it('should be denying when using wrong credentials', async () => {
        await request(app.callback())
            .get('/')
            .auth('test', 'test3')
            .expect(401);

        await request(app.callback())
            .get('/')
            .auth('test4', 'test3')
            .expect(401);
    });

    it('should allow the correct credentials', async () => {
        await request(app.callback())
            .get('/')
            .auth('test', 'test2')
            .expect('Hello World')
            .expect(200);
    });

    if (authConfig['cache']) {
        it('should be faster when using a cache', async () => {
            const startTime1 = new Date().getTime();
            await request(app.callback())
                .get('/')
                .auth('test', 'test2')
                .expect('Hello World')
                .expect(200);
            const endTime1 = new Date().getTime();

            const startTime2 = new Date().getTime();
            await request(app.callback())
                .get('/')
                .auth('test', 'test2')
                .expect('Hello World')
                .expect(200);
            const endTime2 = new Date().getTime();

            expect(endTime2 - startTime2).toBeLessThanOrEqual(endTime1 - startTime1);
        });
    }
});
