import { AppState, appInit, appStep } from './app/app';
import { DebugState, debugInit, debugStep } from './debug/debug';

async function requestAnimationFrameAsync(callback: () => Promise<void>): Promise<void> {
  await new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
  await callback();
}

const viewport = document.getElementById('viewport');

if (!(viewport instanceof HTMLCanvasElement)) {
  throw new Error('No valid render target');
}

const gl = viewport.getContext('webgl2', { antialias: false });

if (!gl) {
  throw new Error('Unable to initialize WebGL 2.0');
}

if (process.env.DEBUG) {
  async function exec(debugState: DebugState): Promise<void> {
    const nextDebugState = await debugStep(debugState);

    await requestAnimationFrameAsync(async () => {
      await exec(nextDebugState);
    });
  }

  const debugState = await debugInit(gl);
  await exec(debugState);
} else {
  async function exec(appState: AppState): Promise<void> {
    const nextAppState = await appStep(appState);

    await requestAnimationFrameAsync(async () => {
      await exec(nextAppState);
    });
  }

  const appState = await appInit(gl);
  await exec(appState);
}
