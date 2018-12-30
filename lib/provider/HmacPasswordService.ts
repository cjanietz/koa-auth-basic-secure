import * as crypto from 'crypto';
import { PasswordService } from '../model/PasswordService';

export interface HmacPasswordServiceConfig {
    alg?: string;
    secret: string;
}

export class HmacPasswordService implements PasswordService {
    constructor(private _config: HmacPasswordServiceConfig) {}

    public compare(input: string, hashedStr: string): Promise<boolean> {
        const hmac = this._getHmac();
        hmac.update(input);
        const inputHashed = hmac.digest().toString('base64');
        return Promise.resolve(hashedStr === inputHashed);
    }

    public hash(input: string): Promise<string> {
        const hmac = this._getHmac();
        hmac.update(input);
        return Promise.resolve(hmac.digest().toString('base64'));
    }

    private _getHmac() {
        const { alg = 'sha256', secret } = this._config;
        return crypto.createHmac(alg, secret);
    }
}
