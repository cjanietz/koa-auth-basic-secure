let useNativeBCrypt = true;
jest.mock('bcrypt', () => {
    if (useNativeBCrypt) {
        return (jest as any).requireActual('bcrypt');
    } else {
        throw new Error('bcrypt is not available');
    }
});
import { BCryptPasswordService } from '../BCryptPasswordService';

it('should check a hash properly', async () => {
    useNativeBCrypt = true;
    const bcryptService = new BCryptPasswordService();

    const resultCorrect = await bcryptService.compare(
        'test',
        '$2a$10$ecG.WAEEjbyxKs9V.b/d3.w/h0.ut/7Tgbw/.4a/62GwTAIIPZ0L.'
    );
    expect(resultCorrect).toBeTruthy();
    const resultWrong = await bcryptService.compare(
        'test2',
        '$2a$10$ecG.WAEEjbyxKs9V.b/d3.w/h0.ut/7Tgbw/.4a/62GwTAIIPZ0L.'
    );
    expect(resultWrong).toBeFalsy();
});

it('should check a hash properly with bcryptjs', async () => {
    useNativeBCrypt = false;
    const bcryptService = new BCryptPasswordService();

    const resultCorrect = await bcryptService.compare(
        'test',
        '$2a$10$ecG.WAEEjbyxKs9V.b/d3.w/h0.ut/7Tgbw/.4a/62GwTAIIPZ0L.'
    );
    expect(resultCorrect).toBeTruthy();
    const resultWrong = await bcryptService.compare(
        'test2',
        '$2a$10$ecG.WAEEjbyxKs9V.b/d3.w/h0.ut/7Tgbw/.4a/62GwTAIIPZ0L.'
    );
    expect(resultWrong).toBeFalsy();
});

it('should hash properly', async () => {
    useNativeBCrypt = true;
    const bcryptService = new BCryptPasswordService();
    const hash = await bcryptService.hash('test', 10);
    expect(await bcryptService.compare('test', hash)).toBeTruthy();
});
