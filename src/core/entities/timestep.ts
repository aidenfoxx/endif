export interface Timestep {
  readonly delta: number;
  readonly accumulator: number;
  readonly previous: number;
}

export function timestepInit(delta: number): Timestep {
  return {
    delta: delta,
    accumulator: 0,
    previous: performance.now()
  };
}

export function timestepStep(timestep: Timestep): Timestep {
  if (timestep.accumulator >= 1) {
    return {
      ...timestep,
      accumulator: timestep.accumulator - 1
    };
  }

  const current = performance.now();

  // Handle timing variance in browser
  if (current > timestep.previous) {
    const delta = current - timestep.previous;

    return {
      delta: timestep.delta,
      previous: current,
      accumulator: timestep.accumulator + delta / timestep.delta
    };
  }

  return timestep;
}
