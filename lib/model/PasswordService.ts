export interface PasswordService {
    compare(input: string, hashedStr: string): Promise<boolean>;
    hash(input: string): Promise<string>;
}

export function isPasswordService(val: object): val is PasswordService {
    return 'compare' in val && 'hash' in val;
}
