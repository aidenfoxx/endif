import { BaseMaterial, BufferKey, Buffer, MeshPrimitive, PerspectiveCamera, Renderer, Scene, BufferView, Mesh } from '@endif/core';
import { DataType } from '@endif/core/src/types';

const cubeData = new Float32Array([
  -1.0,-1.0,-1.0,
  -1.0,-1.0, 1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0,-1.0,
  -1.0,-1.0,-1.0,
  -1.0, 1.0,-1.0,
  1.0,-1.0, 1.0,
  -1.0,-1.0,-1.0,
  1.0,-1.0,-1.0,
  1.0, 1.0,-1.0,
  1.0,-1.0,-1.0,
  -1.0,-1.0,-1.0,
  -1.0,-1.0,-1.0,
  -1.0, 1.0, 1.0,
  -1.0, 1.0,-1.0,
  1.0,-1.0, 1.0,
  -1.0,-1.0, 1.0,
  -1.0,-1.0,-1.0,
  -1.0, 1.0, 1.0,
  -1.0,-1.0, 1.0,
  1.0,-1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0,-1.0,-1.0,
  1.0, 1.0,-1.0,
  1.0,-1.0,-1.0,
  1.0, 1.0, 1.0,
  1.0,-1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0,-1.0,
  -1.0, 1.0,-1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0,-1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  1.0,-1.0, 1.0
]);

const cubeBuffer = new Buffer(cubeData.buffer, cubeData.byteLength, 0);
const cubeBufferView = new BufferView(cubeBuffer, cubeData.length / 3, 3, DataType.FLOAT);
const cubePrimitive = new MeshPrimitive({ [BufferKey.POSITION]: cubeBufferView }, new BaseMaterial());
const cube = new Mesh();
cube.primitives.set('cube', cubePrimitive);

const renderer = new Renderer(document.getElementById('canvas')!);

const camera = new PerspectiveCamera(1.5708, 1.777, .1, 1000, [0, 0, -5]);
camera.frustumCulling = false;

const scene = new Scene();
scene.meshes.set('cube', cube);

function appStep() {
  window.requestAnimationFrame(appStep);

  renderer.renderScene(scene, camera);
}

async function appInit(): Promise<void> {
  console.log('Initialize app...');

  appStep();
}

await appInit();
