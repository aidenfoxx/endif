import { contextInit } from './core/context';
import { appInit } from './app/app';

const window = document.getElementById('window');

if (!(window instanceof HTMLCanvasElement)) {
  throw new Error('Unable to find valid render window');
}

contextInit(window);
appInit();
