export interface Timestep {
  delta: number;
  accumulator: number;
  previousTime: number;
}

export function timestepInit(delta: number): Timestep {
  return {
    delta: delta,
    accumulator: 0,
    previousTime: performance.now(),
  };
}

export function timestepStep(timestep: Timestep): boolean {
  if (timestep.accumulator >= 1) {
    timestep.accumulator -= 1;
    return true;

  }

  const currentTime = performance.now();

  // Handle timing variance in browser
  if (currentTime > timestep.previousTime) {
    const delta = currentTime - timestep.previousTime;

    timestep.previousTime = currentTime;
    timestep.accumulator += delta / timestep.delta;
  }

  return false;
}
