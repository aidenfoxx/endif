import { PerspectiveCamera, Renderer, Scene } from '@endif/core';

let renderer = new Renderer(document.getElementById('viewport')!);
let camera = new PerspectiveCamera(1.5708, 16 / 9, .1, 1000);
let scene = new Scene();

function appStep() {
  window.requestAnimationFrame(appStep);

  renderer.renderScene(scene, camera);
}

async function appInit(): Promise<void> {
  console.log('Initialize app...');

  appStep();
}

await appInit();
