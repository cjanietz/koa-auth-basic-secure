import { Cache } from '../model/Cache';

export class SimpleObjectCache implements Cache {
    private _cacheObj = {};

    public get<T>(key: string): T {
        return this._cacheObj[key];
    }

    public set<T>(key: string, value: T): void {
        this._cacheObj[key] = value;
    }
}
