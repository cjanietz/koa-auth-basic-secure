import { PasswordService } from '../model/PasswordService';

function getBCrypt() {
    let bcrypt;
    try {
        bcrypt = require('bcrypt');
    } catch (err) {
        try {
            bcrypt = require('bcryptjs');
        } catch (err) {
            throw new Error('Either install bcrypt or bcryptjs');
        }
    }

    const hashPromised = (
        data: string | Buffer,
        saltOrRounds: string | number
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(data, saltOrRounds, (err, enc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(enc);
                }
            });
        });
    };

    const comparePromised = (data: string, compareTo: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(data, compareTo, (err, enc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(enc);
                }
            });
        });
    };

    return {
        hash: hashPromised,
        compare: comparePromised
    };
}

interface BCryptPasswordServiceConfig {
    rounds: number;
}

export class BCryptPasswordService implements PasswordService {
    private _bcrypt = getBCrypt();

    constructor(private _config: BCryptPasswordServiceConfig = { rounds: 10 }) {}

    public compare(input: string, hashedStr: string): Promise<boolean> {
        return this._bcrypt.compare(input, hashedStr);
    }

    public async hash(input: string, rounds: number = this._config.rounds): Promise<string> {
        return this._bcrypt.hash(input, rounds);
    }
}
