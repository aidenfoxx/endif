import { bitmapFontGenerateMesh } from '../core/entities/bitmapfont';
import { cameraInit, cameraRotate, cameraTranslate } from '../core/entities/camera';
import { materialInit } from '../core/entities/material';
import { Timestep, timestepInit, timestepStep } from '../core/entities/timestep';
import { fntParse } from '../core/utils/bitmapfont/fnt';
import { degreesToRadians, mat4Orthographic, mat4Perspective } from '../core/utils/math';
import { materialLoad, meshLoad, shaderLoad, textureLoad } from './assets/loader';
import {
  ButtonState,
  inputGetKeyState,
  inputGetMouseButtonState,
  inputGetMousePosition,
  KeyCode,
  KeyState,
} from './input';
import { actorInit } from './renderer/actor';
import { propAddShader, propInit } from './renderer/prop';
import { Scene, sceneAddActor, sceneInit, sceneRender, sceneSetCamera } from './renderer/scene';
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
  const camera = cameraInit([0, 0, -5], [0, 0, 0], perspective);

  const meshRef = await meshLoad(gl, './assets/models/cube.obj');
  const textureRef = await textureLoad(gl, './assets/models/cube.dds');
  const materialRef = await materialLoad('./assets/models/cube.mtl');
  const shaderRef = await shaderLoad(
    gl,
    './assets/shaders/phong.vert',
    './assets/shaders/phong.frag'
  );

  const crate = propAddShader(
    propInit(meshRef, materialRef, { diffuseRef: textureRef }),
    shaderRef
  );
  const crateActor = actorInit(crate, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
  const scene = sceneAddActor(sceneInit(camera), crateActor);

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

export async function appStep(appState: AppState): Promise<AppState> {
  const {
    gl,
    scenes: [scene, gui],
    input: { timestep, previousMouseX, previousMouseY },
  } = appState;

  let nextScene = appState.scenes[0];
  let nextInput = appState.input;

  sceneRender(gl, scene);
  sceneRender(gl, gui);

  if (timestep.accumulator >= 1) {
    let nextCamera = appState.scenes[0].camera;

    if (inputGetMouseButtonState(0) === ButtonState.BUTTON_DOWN) {
      const [mouseX, mouseY] = inputGetMousePosition();

      let startX;
      let startY;

      if (previousMouseX == -1 && previousMouseY == -1) {
        startX = mouseX;
        startY = mouseY;
      } else {
        startX = previousMouseX;
        startY = previousMouseY;
      }

      const maxRotation = 1.570795;
      const rotateX = ((startX - mouseX) / (VIEWPORT_WIDTH / 2)) * maxRotation;
      const rotateY = ((startY - mouseY) / (VIEWPORT_HEIGHT / 2)) * maxRotation;

      nextCamera = cameraRotate(nextCamera, [rotateY, rotateX, 0]);
      nextInput = {
        ...nextInput,
        previousMouseX: mouseX,
        previousMouseY: mouseY,
      };
    } else if (inputGetMouseButtonState(0) === ButtonState.BUTTON_UP) {
      nextInput = {
        ...nextInput,
        previousMouseX: -1,
        previousMouseY: -1,
      };
    }

    if (inputGetKeyState(KeyCode.KEY_W) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [0, 0, -0.1]);
    } else if (inputGetKeyState(KeyCode.KEY_S) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [0, 0, 0.1]);
    }

    if (inputGetKeyState(KeyCode.KEY_A) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [0.1, 0, 0]);
    } else if (inputGetKeyState(KeyCode.KEY_D) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [-0.1, 0, 0]);
    }

    if (nextCamera) {
      nextScene = sceneSetCamera(scene, nextCamera);
    }
  }

  return {
    gl,
    scenes: [nextScene, gui],
    input: {
      ...nextInput,
      timestep: timestepStep(timestep),
    },
  };
}
