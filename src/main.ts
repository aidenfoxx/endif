import {
  BaseMaterial,
  BufferKey,
  Buffer,
  MeshPrimitive,
  PerspectiveCamera,
  Renderer,
  Scene,
  BufferView,
  Mesh,
  DataType,
} from '@endif/core';

const cubeData = new Float32Array([
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
  -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0,
  -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
  -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0,
  1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
  -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,
]);

const cubeBuffer = new Buffer(cubeData.buffer, cubeData.byteLength, 0);
const cubeBufferView = new BufferView(cubeBuffer, cubeData.length / 3, 3, DataType.FLOAT);
const cubePrimitive = new MeshPrimitive(
  { [BufferKey.POSITION]: cubeBufferView },
  new BaseMaterial()
);
const cube = new Mesh([0, 0, -5]);
cube.primitives.set('cube', cubePrimitive);

const renderer = new Renderer(document.getElementById('canvas')!);
const camera = new PerspectiveCamera(1.5708, 1.777, 0.1, 1000, [0, 0, 0]);
const scene = new Scene();
scene.meshes.set('cube', cube);

function appStep() {
  window.requestAnimationFrame(appStep);

  renderer.clear();
  renderer.renderScene(scene, camera);
}

async function appInit(): Promise<void> {
  console.log('Initialize app...');

  appStep();
}

await appInit();
