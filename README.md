# koa-basic-auth-secure

This library is a middleware for protecting Koa Servers/Endpoints with HTTP Basic authentication.
The focus thereby is on providing a hash based authentication, which means no clear text passwords are written to code.
This is similar to the Spring Security approach to HTTP Basic protection.

Features:

-   Multiple users
-   Password hashing
-   Integrated with bcrypt or bcryptjs and Node out of the box
-   100% Customizable hashing implementation
-   Optional Caching for ensuring low latency response times
-   Batteries included (Tool for hashing Password from terminal)
-   Written in 100% Typescript and therefore types are properly included

## Howto

Sample:

```ts
import * as Koa from 'koa';
import { basicAuth } from 'koa-basic-auth-secure';
const app = new Koa();
app.use(
    basicAuth({
        credentials: [{ username: 'example', password: '<HASH HERE>' }],
        passwordProtection: 'mySecret'
    })
);
app.use(ctx => {
    ctx.body = 'Hello World';
});
```

To get the above mentioned hash for a user, use the following command:

```
hashPassword hmac --secret mySecret --input example
hashPassword bcrypt --rounds 10 --input test
```

For the cmd line t work you can use either `yarn run hashPassword ...` or add `hashPassword` to your node scripts.

The library does not force you to use a specific hash implementation, it comes with Hmac (crypto) and bcrypt included.

If you want to use bcrypt, you either have to do:
`npm install --save bcrypt` or `npm install --save bcryptjs`

## Configuration

```ts
{
        credentials: UsernamePasswordCombination[];
        passwordProtection: PasswordService | string;
        customRealm?: string;
        cache?: Cache;
}
```

-   `credentials` (**required**) this is the collection of username password objects. Each entry requires a username and a password
    (Hashed depending) on your password protection config. e.g. `[{username: "test", password: "<HASH>"}]`.

-   `passwordProtection` (**required**) this is the mechanism to verify the password, it can bei either a secret which is used for Hmac by default
    or any other custom implementation such as `BCryptPasswordService` (For examples see the test cases)

-   `customRealm` A custom naming for the password prompt which is presented by the browser to the user.

-   `cache` A cache which fulfills the interface of get/set, such as `node-cache` or the simple implementation in this library.
    This is only of interest if computationally expensive hashing such as bcrypt is used.

## Remarks

This library is compiled with a compatibility target of ES6 and therefore only supports Node 8.21 and newer

_Why use bcrypt over hmac based hashing?_<br/>
Depending on the personal security requirements bcrypt is typically stronger as the user of computational overhead is a lot
stronger than just "salting" a password. It makes bruteforcing even using password lists harder.

_Why not use scrypt instead of bcrypt?_<br/>
From experience the library is a little flaky and hard to debug further scrypt has only been included in very recent versions of Node in crypto.
