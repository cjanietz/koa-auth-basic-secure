import { SimpleObjectCache } from '../SimpleObjectCache';

it('should store a value and retrieve it', () => {
    const cache = new SimpleObjectCache();
    expect(cache.get('test')).toBeUndefined();
    cache.set('test', 'test2');
    expect(cache.get('test')).toEqual('test2');
});
