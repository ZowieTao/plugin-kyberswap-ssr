import { jsonDecode, jsonEncode } from './base';

class cacheStore {
  private _caches = new Map<string, any>();
  private _prefix =
    process.env.NODE_ENV === 'production' ? '' : `${process.env.NODE_ENV}-`;

  get<T = any>(_key: string): T | undefined {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const key = this._prefix + _key;
    if (this._caches.get(key)) {
      return this._caches.get(key);
    }
    const str = localStorage.getItem(key);
    this._caches.set(key, jsonDecode(str ?? '{}').data);

    return this._caches.get(key);
  }

  set = (_key: string, data: any) => {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const key = this._prefix + _key;
    if (data) {
      const saveData = jsonEncode({ data });
      saveData && localStorage.setItem(key, saveData);
    } else {
      localStorage.removeItem(key);
    }
    this._caches.set(key, data);
  };
}

export const storage = new cacheStore();
