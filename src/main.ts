import {
  Timestep,
  Scene,
  degreesToRadians, mat4Orthographic, mat4Perspective,
  cameraInit, cameraRotate, cameraTranslate, timestepInit,
  sceneAddActor, sceneInit, sceneRender, propAddShader, propInit, actorInit, actorSetRotation, parseOBJ, parseDDS, parseMTL, shaderInit
} from '@endif/core';

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

  const cube = await (await fetch('./assets/models/cube.obj')).text();
  const teapotData = await (await fetch('./assets/models/teapot.obj')).text();
  const texture = await (await fetch('./assets/models/cube.dds')).arrayBuffer();
  const materialData = await (await fetch('./assets/models/cube.mtl')).text();

  const cubeRef = parseOBJ(gl, cube);
  const teapotRef = parseOBJ(gl, teapotData);
  const textureRef = parseDDS(gl, texture);
  const materialRef = parseMTL(materialData);

  const vertexData = await (await fetch('./assets/shaders/phong.vert')).text();
  const fragmentData = await (await fetch('./assets/shaders/phong.frag')).text();

  const shaderRef = shaderInit(gl, vertexData, fragmentData);

  const crate = propInit(cubeRef, materialRef, { diffuseRef: textureRef });
  propAddShader(crate, shaderRef);

  const teapot = propInit(teapotRef, materialRef, { diffuseRef: textureRef });
  propAddShader(teapot, shaderRef);

  let scene = sceneInit(camera);

  for (let x = -25; x < 25; x++) {
    for (let y = -25; y < 25; y++) {
      const teapotActor = actorInit(teapot, [x * 5, 0, y * 5], [0, 0, 0], [1, 1, 1]);
      sceneAddActor(scene, teapotActor);
    }
  }

  for (let x = -25; x < 25; x++) {
    for (let y = -25; y < 25; y++) {
      const crateActor = actorInit(crate, [x * 4.5, 0, y * 4.5], [0, 0, 0], [1, 1, 1]);
      sceneAddActor(scene, crateActor);
    }
  }

  console.log('Scene actors:', scene.actors.size);

  return scene;
}

async function buildGUI(gl: WebGL2RenderingContext): Promise<Scene> {
  const width = VIEWPORT_WIDTH / 2;
  const height = VIEWPORT_HEIGHT / 2;
  const perspective = mat4Orthographic(-width, width, height, -height, -1, 1);
  const camera = cameraInit([0, 0, 0], [0, 0, 0], perspective);

  /*const response = await fetch('./assets/fonts/open-sans.fnt');
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

  const text = propInit(meshRef, materialRef, { diffuseRef: textureRef });
  propAddShader(text, shaderRef);

  const textActor = actorInit(text, [-width + 16, height - 8, 0], [0, 0, 0], [32, 32, 32]);*/
  const scene = sceneInit(camera);

  //sceneAddActor(scene, textActor);

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

export async function appStep(appState: AppState): Promise<void> {
  const {
    gl,
    scenes: [scene, gui],
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

  for (const value of scene.actors) {
    actorSetRotation(value, [
      value.rotation[0],
      value.rotation[1],
      value.rotation[2] + .1
    ]);
  }

  cameraTranslate(scene.camera, [0.2, 0, 0]);
  cameraRotate(scene.camera, [0, .005, 0]);
}

// Init app
const viewport = document.getElementById('viewport');

if (!(viewport instanceof HTMLCanvasElement)) {
  throw new Error('No valid render target');
}

const gl = viewport.getContext('webgl2', { antialias: false });

if (!gl) {
  throw new Error('Unable to initialize WebGL 2.0');
}

async function requestAnimationFrameAsync(callback: () => Promise<void>): Promise<void> {
  await new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
  await callback();
}

async function exec(appState: AppState): Promise<void> {
  await appStep(appState);

  await requestAnimationFrameAsync(async () => {
    await exec(appState);
  });
}

const appState = await appInit(gl);
await exec(appState);
