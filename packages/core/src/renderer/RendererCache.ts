import { Observable } from "../reactor/Observable";

interface CacheRecord {
  value: object;
  stateID: number;
  refs: number;
}

export class RendererCache {
  private static sharedCache: WeakMap<object, CacheRecord> = new WeakMap();

  public cache: WeakMap<object, CacheRecord> = new WeakMap();

  // TODO: We're going to have a hard time cleaning up a scene because we don't
  // know how to properly destroy the different types in out cache

  public getValue(key: object, createValue: () => object): object {
    let record = RendererCache.sharedCache.get(key);

    // Update shared cache
    if (!record) {
      record = {
        value: createValue(),
        stateID: -1,
        refs: 0,
      };
      RendererCache.sharedCache.set(key, record);
    }

    // Link record to scene
    if (!this.cache.has(key)) {
      this.cache.set(key, record);
      record.refs++;
    }

    return record.value;
  }

  public observeValue(key: Observable, createValue: (previousValue?: object) => object): object {
    let record = RendererCache.sharedCache.get(key);

    // Update shared cache
    if (!record) {
      record = {
        value: createValue(),
        stateID: key?.stateID,
        refs: 0,
      };
      RendererCache.sharedCache.set(key, record);
    } else if (record.stateID !== key.stateID) {
      record.value = createValue(record.value);
      record.stateID = key.stateID;
    }

    // Link record to scene
    if (!this.cache.has(key)) {
      this.cache.set(key, record);
      record.refs++;
    }

    return record.value;
  }

  public deleteValue(key: object, deleteValue: (value: object) => void): void {
    const record = this.cache.get(key);

    if (!record) {
      return;
    }

    // Destroy if no scene will reference record
    if (record.refs === 1) {
      RendererCache.sharedCache.delete(key);
      deleteValue(record.value);
    } else {
      record.refs--;
    }

    this.cache.delete(key);    
  }
}
