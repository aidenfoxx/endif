import { initContext } from './core/context';
import { initApp } from './app/app';

const window = document.getElementById('window');

if (!(window instanceof HTMLCanvasElement)) {
  throw new Error('Unable to find valid render window.');
}

initContext(window);
initApp();
