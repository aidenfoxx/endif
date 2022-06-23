import { KeyState, KeyCode, inputGetKeyState, inputGetMouseButtonState, ButtonState, inputGetMousePosition } from './input';
import { textureFetch } from './assets/texture';
import { shaderFetch } from './assets/shader';
import { materialFetch } from './assets/material';
import { meshFetch } from './assets/mesh';
import { contextInit } from '../core/context';
import { cameraInit, cameraRotate, cameraTranslate } from '../core/entities/camera';
import { Timestep, timestepInit, timestepStep } from '../core/entities/timestep';
import { degreesToRadians, mat4Perspective } from '../core/utils/math';
import { Scene, sceneAddActor, sceneInit, sceneRender, sceneSetCamera } from './renderer/scene';
import { propAddShader, propInit } from './renderer/prop';
import { actorInit } from './renderer/actor';

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

interface AppState {
  readonly gl: WebGL2RenderingContext;
  readonly scene: Scene,
  readonly input: {
    readonly timestep: Timestep;
    readonly previousMouseX: number,
    readonly previousMouseY: number
  }
}

function _render(app: AppState): void {
  const {
    gl,
    scene,
    input: {
      timestep,
      previousMouseX,
      previousMouseY
    }
  } = app;

  let nextScene = app.scene;
  let nextInput = app.input;

  sceneRender(gl, scene);

  if (timestep.accumulator >= 1) {
    let nextCamera = app.scene.camera;

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
      const rotationX = ((startX - mouseX) / (CANVAS_WIDTH / 2)) * maxRotation;
      const rotationY = ((startY - mouseY) / (CANVAS_HEIGHT / 2)) * maxRotation;

      nextCamera = cameraRotate(nextCamera, [rotationY, rotationX, 0]);
      nextInput = {
        ...nextInput,
        previousMouseX: mouseX,
        previousMouseY: mouseY
      };
    } else if (inputGetMouseButtonState(0) === ButtonState.BUTTON_UP) {
      nextInput = {
        ...nextInput,
        previousMouseX: -1,
        previousMouseY: -1
      };
    }

    if (inputGetKeyState(KeyCode.KEY_W) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [0, 0, -.1]);
    } else if (inputGetKeyState(KeyCode.KEY_S) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [0, 0, .1]);
    }

    if (inputGetKeyState(KeyCode.KEY_A) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [.1, 0, 0]);
    } else if (inputGetKeyState(KeyCode.KEY_D) === KeyState.KEY_DOWN) {
      nextCamera = cameraTranslate(nextCamera, [-.1, 0, 0]);
    }

    if (nextCamera) {
      nextScene = sceneSetCamera(scene, nextCamera);
    }
  }

  requestAnimationFrame(() => _render({
    gl,
    scene: nextScene,
    input: {
      ...nextInput,
      timestep: timestepStep(timestep)
    }
  }));
}

async function _buildScene(gl: WebGL2RenderingContext): Promise<Scene> {
  const perspective = mat4Perspective(degreesToRadians(90), CANVAS_WIDTH / CANVAS_HEIGHT, .1, 1000);
  const camera = cameraInit([.5, 0, -3], [0, 0, 0], perspective);

  const meshRef = await meshFetch(gl, './assets/models/cube.obj');
  const materialRef = await materialFetch('./assets/models/cube.mtl');
  const textureRef = await textureFetch(gl, './assets/models/cube.dds');
  const shaderRef = await shaderFetch(gl, './assets/shaders/phong.vert', './assets/shaders/phong.frag');

  const crate = propAddShader(propInit(meshRef, materialRef, { diffuseRef: textureRef }), shaderRef);
  const crateActor = actorInit(crate, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
  const scene = sceneAddActor(sceneInit(camera), crateActor);

  return scene;
}

export async function appInit(): Promise<void> {
  console.log('Initialize app...');

  const viewport = document.getElementById('viewport');

  if (!(viewport instanceof HTMLCanvasElement)) {
    throw new Error('Unable to find valid render target');
  }

  const gl = contextInit(viewport);

  gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  const scene = await _buildScene(gl);

  requestAnimationFrame(() => _render({
    gl,
    scene,
    input: {
      timestep: timestepInit(1000 / 60),
      previousMouseX: -1,
      previousMouseY: -1
    }
  }));
}
