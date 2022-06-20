import { KeyState, KeyCode, inputGetKeyState, inputGetMouseButtonState, ButtonState, inputGetMousePosition } from './input';
import { textureFetch, TextureRef } from './assets/texture';
import { shaderFetch, ShaderRef } from './assets/shader';
import { materialFetch, MaterialRef } from './assets/material';
import { meshFetch, MeshRef } from './assets/mesh';
import { contextInit } from '../core/context';
import { Camera, cameraInit, cameraRotate, cameraTranslate } from '../core/entities/camera';
import { Timestep, timestepInit, timestepStep } from '../core/entities/timestep';
import {
  degreesToRadians,
  mat4Invert,
  mat4Multiply,
  mat4Perspective,
  mat4RotationEuler,
  mat4Scale,
  mat4Translation,
  mat4Transpose
} from '../core/utils/math';

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

interface AppState {
  readonly gl: WebGL2RenderingContext;
  readonly render: {
    camera: Camera;
    meshRef: MeshRef;
    textureRef: TextureRef;
    materialRef: MaterialRef;
    shaderRef: ShaderRef;
  },
  readonly input: {
    timestep: Timestep;
    previousMouseX: number,
    previousMouseY: number
  }
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

  const timestep = timestepInit(1000 / 60);
  const perspective = mat4Perspective(degreesToRadians(90), CANVAS_WIDTH / CANVAS_HEIGHT, .1, 1000);
  const camera = cameraInit([.5, 0, -3], [0, 0, 0], perspective);

  const meshRef = await meshFetch(gl, './assets/models/cube.obj');
  const textureRef = await textureFetch(gl, './assets/models/cube.dds');
  const materialRef = await materialFetch('./assets/models/cube.mtl');
  const shaderRef = await shaderFetch(gl, './assets/shaders/phong.vert', './assets/shaders/phong.frag');

  const app = {
    gl,
    render: {
      camera,
      meshRef,
      textureRef,
      materialRef,
      shaderRef
    },
    input: {
      timestep,
      previousMouseX: -1,
      previousMouseY: -1
    }
  }

  requestAnimationFrame(() => render(app));
}

function render(app: AppState) {
  const {
    gl,
    render: {
      meshRef,
      textureRef,
      shaderRef
    },
    input: {
      timestep,
      previousMouseX,
      previousMouseY
    }
  } = app;

  if (timestep.accumulator >= 1) {
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

      app.render.camera = cameraRotate(app.render.camera, [rotationY, rotationX, 0]);
      app.input.previousMouseX = mouseX;
      app.input.previousMouseY = mouseY;
    }

    if (inputGetMouseButtonState(0) === ButtonState.BUTTON_UP) {
      app.input.previousMouseX = -1;
      app.input.previousMouseY = -1;
    }

    if (inputGetKeyState(KeyCode.KEY_W) === KeyState.KEY_DOWN) {
      app.render.camera = cameraTranslate(app.render.camera, [0, 0, -.1]);
    } else if (inputGetKeyState(KeyCode.KEY_S) === KeyState.KEY_DOWN) {
      app.render.camera = cameraTranslate(app.render.camera, [0, 0, .1]);
    }

    if (inputGetKeyState(KeyCode.KEY_A) === KeyState.KEY_DOWN) {
      app.render.camera = cameraTranslate(app.render.camera, [.1, 0, 0]);
    } else if (inputGetKeyState(KeyCode.KEY_D) === KeyState.KEY_DOWN) {
      app.render.camera = cameraTranslate(app.render.camera, [-.1, 0, 0]);
    }
  }

  app.input.timestep = timestepStep(timestep);

  const modelView = mat4Multiply(
    app.render.camera.view,
    mat4Multiply(
      mat4Translation([-.5, -.5, -.5]),
      mat4Multiply(
        mat4Scale([1, 1, 1,]),
        mat4RotationEuler([0, 0, 0])
      )
    )
  );

  // Clear viewport
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Bind shader
  gl.useProgram(shaderRef.program);

  const modelViewLocation = gl.getUniformLocation(shaderRef.program, 'modelView');
  gl.uniformMatrix4fv(modelViewLocation, false, new Float32Array(modelView));

  const projectionLocation = gl.getUniformLocation(shaderRef.program, 'projection');
  gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(app.render.camera.projection));

  const normalMatrix = mat4Transpose(mat4Invert(modelView));
  const normalMatrixLocation = gl.getUniformLocation(shaderRef.program, 'normalMatrix');
  gl.uniformMatrix4fv(normalMatrixLocation, false, new Float32Array(normalMatrix));

  // Bind textures
  gl.bindTexture(gl.TEXTURE_2D, textureRef.texture);

  // Draw mesh
  gl.bindVertexArray(meshRef.vao);
  gl.drawElements(gl.TRIANGLES, meshRef.elements, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(() => render(app));
}
