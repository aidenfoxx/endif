export class Timestep {
  public delta: Readonly<number>;

  private accumulator: number = 0;

  private previousTime: number = performance.now();

  constructor(delta: number) {
    this.delta = delta;
  }

  public step(): boolean {
    if (this.accumulator >= 1) {
      this.accumulator -= 1;
      return true;
    }
  
    const currentTime = performance.now();
  
    // Handle timing variance in browser
    if (currentTime > this.previousTime) {
      const delta = currentTime - this.previousTime;
  
      this.previousTime = currentTime;
      this.accumulator += delta / this.delta;
    }
  
    return false;
  }
}
