import { HmacPasswordService } from '../HmacPasswordService';

const helloHash = '8VHqJL2pGhjom4u1eT7zJLKgITPM4VoopxmsvS5YqYY=';

it('should check a hash properly', async () => {
    const passwordService = new HmacPasswordService({ secret: 'test' });
    expect(await passwordService.compare('hello', helloHash)).toBeTruthy();
});

it('should hash properly', async () => {
    const passwordService = new HmacPasswordService({ secret: 'test' });
    expect(await passwordService.hash('hello')).toEqual(helloHash);
});
