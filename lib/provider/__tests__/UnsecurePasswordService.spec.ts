import { UnsecurePasswordService } from '../UnsecurePasswordService';

it('should validate a password with plain text', async () => {
    const passwordService = new UnsecurePasswordService();
    expect(await passwordService.compare('test', 'test')).toBeTruthy();
    expect(await passwordService.compare('test', 'test2')).not.toBeTruthy();
});

it('should output the original value', async () => {
    const passwordService = new UnsecurePasswordService();
    expect(await passwordService.hash('test')).toEqual('test');
});
