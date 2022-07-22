export abstract class Observable {
  private static uniqueID = 0;

  public stateID = Observable.uniqueID++;

  public watch(target: any, property: PropertyKey): void {
    let propertyRef: any = target[property];

    Object.defineProperty(target, property, {
      get: function () {
        return propertyRef;
      },
      set: function (value) {
        propertyRef = value;
        this.stateID = Observable.uniqueID++;
      },
    });
  }
}
