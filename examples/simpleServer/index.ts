import * as Koa from 'koa';
import { basicAuth } from '../../lib';

const app = new Koa();
app.use(
    basicAuth({
        credentials: [
            // Password is test2
            { username: 'test', password: 'rjRQpXztmEP9/BTu5S366Pzg9aTQBarV1Kzmm2dNNa4=' },
            { username: 'test2', password: 'rjRQpXztmEP9/BTu5S366Pzg9aTQBarV1Kzmm2dNNa4=' }
        ],
        passwordProtection: 'test'
    })
);
app.use(async (ctx: Koa.Context) => {
    ctx.body = 'Hello World';
});

app.listen(3000, () => {
    console.log('App is listening');
});
