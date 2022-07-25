import { Observable } from "../../reactor/Observable";

interface AssetRecord {
  stateID: number;
  value: object;
  refs: number;
}

class AssetIterator implements Iterator<any> {
  constructor(private keys: Set<WeakRef<object>>, private cache: WeakMap<object, AssetRecord>) {}

  public next(): IteratorResult<[object, object]> {
    for (const value of this.keys) {
      const key = value.deref();

      if (key) {
        const record = this.cache.get(key);

        return { value: [key, record!.value], done: false };
      } else {
        // Clean up garbage colelcted key
        this.keys.delete(value);
      }
    }

    return { value: undefined, done: true };
  }
}

export class AssetCache {
  private static sharedCache: WeakMap<object, AssetRecord> = new WeakMap();

  // Track keys so we can iterate the WeakMap
  private keys: Set<WeakRef<object>> = new Set();
  private cache: WeakMap<object, AssetRecord> = new WeakMap();

  public getValue(key: object, callback: () => object): object {
    let record = AssetCache.sharedCache.get(key);

    // Create record in shared cache
    if (!record) {
      record = {
        stateID: -1,
        value: callback(),
        refs: 0,
      };
      AssetCache.sharedCache.set(key, record);
    }

    // Link record to instance
    if (!this.cache.has(key)) {
      this.keys.add(new WeakRef(key));
      this.cache.set(key, record);
      record.refs++;
    }

    return record.value;
  }

  public observeValue(key: Observable, callback: (previousValue?: object) => object): object {
    let record = AssetCache.sharedCache.get(key);

    // Create or update record in shared cache
    if (!record) {
      record = {
        stateID: key.stateID,
        value: callback(),
        refs: 0,
      };
      AssetCache.sharedCache.set(key, record);
    } else if (record.stateID !== key.stateID) {
      record.stateID = key.stateID;
      record.value = callback(record.value);
    }

    // Link record to instance
    if (!this.cache.has(key)) {
      this.keys.add(new WeakRef(key));
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

    // Destroy shared record if last reference
    if (record.refs === 1) {
      AssetCache.sharedCache.delete(key);
      callback(record.value);
    } else {
      record.refs--;
    }

    // Orphaned keys will be cleaned up during iteration
    this.cache.delete(key);
  }

  public forEach(callback: (value: [object, object]) => void): void {    
    for (const value of this) {
      callback(value);
    }
  }

  public entries(): AssetIterator {
    return new AssetIterator(this.keys, this.cache);
  }

  public [Symbol.iterator]() {
    return new AssetIterator(this.keys, this.cache);
  }
}
