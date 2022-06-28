import { appInit, appStep } from './app/app';
import { debugInit, debugStep } from './debug/debug';

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
  const debugState = await debugInit(gl);

  async function exec(): Promise<void> {
    await debugStep(debugState);

    await requestAnimationFrameAsync(async () => {
      await exec();
    });
  }


  await exec();
} else {
  const appState = await appInit(gl);

  async function exec(): Promise<void> {
    await appStep(appState);

    await requestAnimationFrameAsync(async () => {
      await exec();
    });
  }

  await exec();
}
