import { createUniformBuffer } from '../utils/gl/buffer';
import { aabbTransform } from '../utils/math';
import { Camera } from './cameras/Camera';
import { Context } from './Context';
import { Material } from './materials/Material';
import { Mesh } from './meshes/Mesh';
import { BufferKey, MeshPrimitive } from './meshes/MeshPrimitive';
import { Shader } from './shaders/Shader';

type RenderQueue = Map<Shader, Map<Material, Map<MeshPrimitive, Set<Mesh>>>>;

// TODO: Fix these imports in Shader
export const CAMERA_BUFFER_INDEX = 0;
export const CAMERA_BUFFER_SIZE = 256;

export const MATERIAL_BUFFER_INDEX = 1;
export const MATERIAL_BUFFER_SIZE = 256;

// TODO: Remove debug
const renderedElement = document.getElementById('rendered')!;
let rendered = 0;
let notRendered = 0;
let drawCalls = 0;

export class Scene {
  public readonly meshes: Map<PropertyKey, Mesh> = new Map();

  private gl: WebGL2RenderingContext;

  private cameraBuffer: WebGLBuffer;

  constructor() {
    this.gl = Context.getContent();
    this.cameraBuffer = createUniformBuffer(this.gl, CAMERA_BUFFER_SIZE);

    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, CAMERA_BUFFER_INDEX, this.cameraBuffer);
  }

  public render(camera: Camera): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const renderQueue: RenderQueue = new Map();

    if (camera.frustumCulling) {
      for (const mesh of this.meshes.values()) {
        const matrix = mesh.getMatrix();

        for (const primitive of mesh.primitives.values()) {
          const aabb = aabbTransform(primitive.aabb, matrix);
          const isVisible = camera.isVisible(aabb);

          if (isVisible) {
            rendered++;  
            this.parsePrimitive(mesh, primitive, renderQueue);
          }
        }
      }
    } else {
      for (const mesh of this.meshes.values()) {
        for (const primitive of mesh.primitives.values()) {
          this.parsePrimitive(mesh, primitive, renderQueue);
        }
      }
    }

    // TODO: Remove
    renderedElement.innerHTML = `Drawn: ${rendered}, Not Drawn: ${notRendered}, Draw Calls: ${drawCalls}`;
    rendered = 0;
    notRendered = 0;
    drawCalls = 0;

    // Bind camera data
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.cameraBuffer);
    this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 64, new Float32Array(camera.getMatrix()));
    this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 128, new Float32Array(camera.getProjection()));

    for (const [shader, materialQueue] of renderQueue) {
      // Bind shader
      shader.bind();

      for (const [material, primitiveQueue] of materialQueue) {
        material.bind();

        // Bind buffer without material unsetting it
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.cameraBuffer);

        for (const [primitive, meshQueue] of primitiveQueue) {
          primitive.bind();
          
          const indexBuffer = primitive.buffers[BufferKey.INDEX];
          const positionBuffer = primitive.buffers[BufferKey.POSITION];

          for (const mesh of meshQueue) {
            // Update model matrix
            this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, new Float32Array(mesh.getMatrix()));

            if (indexBuffer) {
              this.gl.drawElements(primitive.mode, indexBuffer.count, indexBuffer.type, 0);
            } else {
              this.gl.drawArrays(primitive.mode, 0, positionBuffer.count);
            }

            drawCalls++;
          }
        }
      }
    }
  }

  private parsePrimitive(mesh: Mesh, primitive: MeshPrimitive, renderQueue: RenderQueue): void {
    let materialQueue = renderQueue.get(primitive.material.shader);

    if (!materialQueue) {
      materialQueue = new Map();
      renderQueue.set(primitive.material.shader, materialQueue);
    }

    let primitiveQueue = materialQueue.get(primitive.material);

    if (!primitiveQueue) {
      primitiveQueue = new Map();
      materialQueue.set(primitive.material, primitiveQueue);
    }

    let meshQueue = primitiveQueue.get(primitive);

    if (!meshQueue) {
      meshQueue = new Set();
      primitiveQueue.set(primitive, meshQueue);
    }

    meshQueue.add(mesh);
  }
}
