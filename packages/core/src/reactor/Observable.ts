export abstract class Observable {
  private static uniqueID = 0;

  public readonly stateID = Observable.uniqueID++;

  public updateState(): void {
    (this.stateID as number) = Observable.uniqueID++;
  }
}
