import { Observable } from "../../reactor/Observable";

interface VisibilityRecord {
  stateID: number;
  value?: boolean;
}

export class VisbilityCache {
  private cache: WeakMap<Observable, VisibilityRecord> = new WeakMap();

  public observeChange(key: Observable): boolean {
    const record = this.cache.get(key);

    if (!record) {
      this.cache.set(key, { stateID: key.stateID });
      return true;
    } else if (key.stateID !== record.stateID) {
      record.stateID = key.stateID;
      return true;
    }

    return false;
  };

  public getVisibility(key: Observable): boolean | undefined {
    return this.cache.get(key)?.value;
  }

  public setVisbility(key: Observable, isVisible: boolean): void {
    const record = this.cache.get(key);

    if (record) {
      record.value = isVisible;
    }
  }
}