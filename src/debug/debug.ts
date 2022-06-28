import { appInit, AppState, appStep } from '../app/app';

export type DebugState = AppState;

// App middleware for debugging app state
export async function debugInit(gl: WebGL2RenderingContext): Promise<DebugState> {
  return appInit(gl);
}

export async function debugStep(debugState: DebugState): Promise<void> {
  return appStep(debugState);
}
