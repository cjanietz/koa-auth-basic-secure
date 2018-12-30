import { PasswordService } from '../model/PasswordService';

export class UnsecurePasswordService implements PasswordService {
    public compare(input: string, hashedStr: string): Promise<boolean> {
        return Promise.resolve(input === hashedStr);
    }

    public hash(input: string): Promise<string> {
        return Promise.resolve(input);
    }
}
