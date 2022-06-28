import { bitmapFontGenerateMesh } from '../core/entities/bitmapfont';
import { cameraInit, cameraRotate, cameraTranslate } from '../core/entities/camera';
import { materialInit } from '../core/entities/material';
import { Timestep, timestepInit } from '../core/entities/timestep';
import { fntParse } from '../core/utils/bitmapfont/fnt';
import { degreesToRadians, mat4Orthographic, mat4Perspective } from '../core/utils/math';
import { materialLoad, meshLoad, shaderLoad, textureLoad } from './assets/loader';
import { actorInit, actorSetRotation } from './renderer/actor';
import { propAddShader, propInit } from './renderer/prop';
import { Scene, sceneAddActor, sceneInit, sceneRemoveActor, sceneRender, sceneSetCamera } from './renderer/scene';
import { vaoCreate } from './utils/gl/vao';

const VIEWPORT_WIDTH = 1600;
const VIEWPORT_HEIGHT = 900;

export interface AppState {
  readonly gl: WebGL2RenderingContext;
  readonly scenes: Scene[];
  readonly input: {
    readonly timestep: Timestep;
    readonly previousMouseX: number;
    readonly previousMouseY: number;
  };
}

async function buildScene(gl: WebGL2RenderingContext): Promise<Scene> {
  const perspective = mat4Perspective(
    degreesToRadians(90),
    VIEWPORT_WIDTH / VIEWPORT_HEIGHT,
    0.1,
    1000
  );
  const camera = cameraInit([0, -10, -40], [0, 0, 0], perspective);

  const cubeRef = await meshLoad(gl, './assets/models/cube.obj');
  const teapotRef = await meshLoad(gl, './assets/models/teapot.obj');
  const textureRef = await textureLoad(gl, './assets/models/cube.dds');
  const materialRef = await materialLoad('./assets/models/cube.mtl');
  const shaderRef = await shaderLoad(
    gl,
    './assets/shaders/phong.vert',
    './assets/shaders/phong.frag'
  );

  const crate = propAddShader(
    propInit(cubeRef, materialRef, { diffuseRef: textureRef }),
    shaderRef
  );
  const teapot = propAddShader(
    propInit(teapotRef, materialRef, { diffuseRef: textureRef }),
    shaderRef
  );

  let scene = sceneInit(camera);

  for (let x = -8; x < 8; x++) {
    for (let y = -8; y < 8; y++) {
      const teapotActor = actorInit(teapot, [x * 5, 0, y * 5], [0, 0, 0], [1, 1, 1]);
      scene = sceneAddActor(scene, teapotActor);
    }
  }

  for (let x = -8; x < 8; x++) {
    for (let y = -8; y < 8; y++) {
      const crateActor = actorInit(crate, [x * 4.5, 0, y * 4.5], [0, 0, 0], [1, 1, 1]);
      scene = sceneAddActor(scene, crateActor);
    }
  }

  return scene;
}

async function buildGUI(gl: WebGL2RenderingContext): Promise<Scene> {
  const width = VIEWPORT_WIDTH / 2;
  const height = VIEWPORT_HEIGHT / 2;
  const perspective = mat4Orthographic(-width, width, height, -height, -1, 1);
  const camera = cameraInit([0, 0, 0], [0, 0, 0], perspective);

  const response = await fetch('./assets/fonts/open-sans.fnt');
  const font = fntParse(await response.text());
  const fontMesh = bitmapFontGenerateMesh(font, 'Hello World');

  const textureRef = await textureLoad(gl, `./assets/fonts/${font.texture}`);
  const meshRef = {
    path: '',
    mesh: fontMesh,
    vao: vaoCreate(gl, fontMesh),
  };
  const materialRef = {
    path: '',
    material: materialInit([0, 0, 0]),
  };
  const shaderRef = await shaderLoad(
    gl,
    './assets/shaders/flat.vert',
    './assets/shaders/flat.frag'
  );

  const text = propAddShader(propInit(meshRef, materialRef, { diffuseRef: textureRef }), shaderRef);
  const textActor = actorInit(text, [-width + 16, height - 8, 0], [0, 0, 0], [32, 32, 32]);
  const scene = sceneAddActor(sceneInit(camera), textActor);

  return scene;
}

export async function appInit(gl: WebGL2RenderingContext): Promise<AppState> {
  console.log('Initialize app...');

  gl.viewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const scene = await buildScene(gl);
  const gui = await buildGUI(gl);

  return {
    gl,
    scenes: [scene, gui],
    input: {
      timestep: timestepInit(1000 / 60),
      previousMouseX: -1,
      previousMouseY: -1,
    },
  };
}

const fpsElement = document.getElementById('fps');

let previousTime = performance.now();
let counter = 0;
let fps = 0;

export async function appStep(appState: AppState): Promise<AppState> {
  const {
    gl,
    scenes: [scene, gui],
    input,
  } = appState;

  const nextTime = performance.now();

  counter += nextTime - previousTime;
  previousTime = nextTime;
  fps++;

  if (counter >= 1000) {
    fpsElement!.innerHTML = `FPS: ${fps}`;
    counter = 0;
    fps = 0;
  }

  sceneRender(gl, scene);
  sceneRender(gl, gui);

  let nextScene = scene;

  for (const value of scene.actors) {
    const nextActor = actorSetRotation(value, [
      value.rotation[0],
      value.rotation[1],
      value.rotation[2] + .1
    ]);

    nextScene = sceneAddActor(sceneRemoveActor(nextScene, value), nextActor);
  }

  const nextCamera = cameraRotate(cameraTranslate(scene.camera, [0.2, 0, 0]), [0, .005, 0]);
  nextScene = sceneSetCamera(nextScene, nextCamera);

  return {
    gl,
    scenes: [nextScene, gui],
    input,
  };
}
