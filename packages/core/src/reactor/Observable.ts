export abstract class Observable {
  private static uniqueID = 0;

  public stateID = Observable.uniqueID++;

  public watch(target: any, property: PropertyKey): void {
    const propertyDesc = Object.getOwnPropertyDescriptor(target, property);
    let propertyRef = target[property];
    
    Object.defineProperty(target, property, {
      get: () => {
        return propertyRef;
      },
      set: (value) => {
        propertyDesc?.set?.(value);
        propertyRef = value;
        this.stateID = Observable.uniqueID++;
      },
    });
  }

  public unwatch(target: any, property: PropertyKey): void {
    const value = target[property];

    Object.defineProperty(target, property, {
      writable: true,
      value
    });
  }
}
