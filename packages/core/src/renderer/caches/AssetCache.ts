import { Observable } from '../../reactor/Observable';

interface AssetRecord {
  stateID: number;
  value: object;
  refs: number;
}

class KeyIterator implements IterableIterator<object> {
  private iterator;

  constructor(private keys: Set<WeakRef<object>>) {
    this.iterator = keys.keys();
  }

  public next(): IteratorResult<object> {
    let result = this.iterator.next();

    while (!result.done) {
      const key = result.value.deref();

      if (key) {
        return { value: key, done: false };
      }

      // Clean up garbage colelcted key
      this.keys.delete(result.value);

      result = this.iterator.next();
    }

    return { value: undefined, done: true };
  }

  public [Symbol.iterator](): IterableIterator<object> {
    return this;
  }
}

export class AssetCache {
  private static sharedCache: WeakMap<object, AssetRecord> = new WeakMap();

  // Track keys so we can iterate the WeakMap
  private keyRefs: Set<WeakRef<object>> = new Set(); 
  private cache: WeakMap<object, AssetRecord> = new WeakMap();

  public getValue(key: object, callback: () => object): object {
    let record = AssetCache.sharedCache.get(key);

    if (!record) {
      record = { stateID: -1, value: callback(), refs: 0 };
      AssetCache.sharedCache.set(key, record);
    }

    // Link record to instance
    if (!this.cache.has(key)) {
      this.keyRefs.add(new WeakRef(key));
      this.cache.set(key, record);

      record.refs++;
    }

    return record.value;
  }

  public observeValue(key: Observable, callback: (previousValue?: object) => object): object {
    let record = AssetCache.sharedCache.get(key);

    if (!record) {
      record = { stateID: key.stateID, value: callback(), refs: 0 };
      AssetCache.sharedCache.set(key, record);
    } else if (record.stateID !== key.stateID) {
      record.stateID = key.stateID;
      record.value = callback(record.value);
    }

    // Link record to instance
    if (!this.cache.has(key)) {
      this.keyRefs.add(new WeakRef(key));
      this.cache.set(key, record);

      record.refs++;
    }

    return record.value;
  }

  public deleteValue(key: object, callback: (value: object) => void): void {
    const record = this.cache.get(key);

    if (!record) {
      return;
    }

    if (record.refs === 1) {
      AssetCache.sharedCache.delete(key);
      callback(record.value);
    } else {
      record.refs--;
    }

    // Orphaned keys are cleaned up during iteration
    this.cache.delete(key);
  }

  public keys(): IterableIterator<object> {
    return new KeyIterator(this.keyRefs);
  }
}
