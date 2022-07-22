import { Scene } from './Scene';
import { Camera } from './cameras/Camera';
import { Mesh } from './meshes/Mesh';
import { MeshPrimitive } from './meshes/MeshPrimitive';
import { createProgram } from '../utils/gl/shader';
import { createMaterialUniform } from '../utils/gl/material';
import { aabbTransform } from '../utils/math';
import { Observable } from '../reactor/Observable';

interface CacheRecord {
  value: any;
  stateID: number;
  refs: number;
}

type RenderQueue = Map<WebGLProgram, Map<WebGLBuffer, Map<WebGLVertexArrayObject, Mesh>>>;

export class Renderer {
  private gl: WebGL2RenderingContext;

  // Store GL elements in general cache for shared use
  private rendererCache: WeakMap<any, CacheRecord> = new WeakMap();
  // Keep assets with scene for cleanup
  private sceneCache: Map<Scene, WeakMap<any, CacheRecord>> = new Map();
  private sceneVisibility: Map<Scene, WeakMap<Camera, WeakMap<MeshPrimitive, boolean>>> = new Map();

  constructor(canvas: HTMLElement, options?: WebGLContextAttributes) {
    // TODO: This looks ugly
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Invalid canvas element');
    }

    const gl = canvas.getContext('webgl2', options);

    if (!gl) {
      throw new Error('Unable to initialize WebGL context');
    }

    this.gl = gl;
  }

  public renderScene(scene: Scene, camera: Camera) {
    // Initialize scene cache
    let sceneCache = this.sceneCache.get(scene);

    if (!sceneCache) {
      sceneCache = new WeakMap();
      this.sceneCache.set(scene, sceneCache);
    }

    const renderQueue: RenderQueue = new Map();

    if (camera.frustumCulling) {
      // Initialize visibility cache
      let sceneVisibility = this.sceneVisibility.get(scene);

      if (!sceneVisibility) {
        sceneVisibility = new WeakMap();
        this.sceneVisibility.set(scene, sceneVisibility);
      }

      let cameraVisibility = sceneVisibility.get(camera);

      if (!cameraVisibility) {
        cameraVisibility = new WeakMap();
        sceneVisibility.set(camera, cameraVisibility);
      }

      // Generate render queue
      const hasCameraChanged = this.hasRecordChaned(camera, sceneCache);

      for (const [_, mesh] of scene.meshes) {
        const hasMeshChanged = this.hasRecordChaned(mesh, sceneCache);

        for (const [_, primitive] of mesh.primitives) {
          const hasPrimitiveChanged = this.hasRecordChaned(primitive, sceneCache); // TODO: This could cause issues with VAO
          const hasChanged = hasCameraChanged || hasMeshChanged || hasPrimitiveChanged;

          // Reuse previous visibility is nothing changed
          const wasVisible = cameraVisibility.get(primitive);

          if (!wasVisible && !hasChanged) {
            continue;
          }

          const aabb = aabbTransform(primitive.getAABB(), mesh.getMatrix());
          const isVisible = camera.isVisible(aabb);

          cameraVisibility.set(primitive, isVisible);

          if (isVisible) {
            this.parsePrimitive(primitive, renderQueue, sceneCache);
          }
        }
      }
    } else {
      // Generate render queue
      for (const [_, mesh] of scene.meshes) {
        for (const [_, primitive] of mesh.primitives) {
          this.parsePrimitive(primitive, renderQueue, sceneCache);
        }
      }
    }

    // Handle render queue
  }

  private parsePrimitive(
    primitive: MeshPrimitive,
    renderQueue: RenderQueue,
    sceneCache: WeakMap<any, CacheRecord>
  ): void {
    const material = primitive.material;
    const shader = material.shader;

    // Add shader to render queue
    let shaderRecord = this.rendererCache.get(shader);

    if (!shaderRecord) {
      shaderRecord = {
        value: createProgram(this.gl, shader.vertexSource, shader.fragmentSource),
        stateID: -1,
        refs: 0,
      };
      this.rendererCache.set(shader, shaderRecord);
    }

    if (!sceneCache.has(shader)) {
      shaderRecord.refs++;
      sceneCache.set(shader, shaderRecord);
    }

    let shaderQueue = renderQueue.get(shaderRecord.value);

    if (!shaderQueue) {
      shaderQueue = new Map();
      renderQueue.set(shaderRecord.value, shaderQueue);
    }

    // Add material to render queue
    let materialRecord = this.rendererCache.get(material);

    if (!materialRecord) {
      materialRecord = {
        value: createMaterialUniform(this.gl), // TODO: Implement
        stateID: material.stateID,
        refs: 0,
      };
      this.rendererCache.set(material, materialRecord);
    } else if (material.stateID !== materialRecord.stateID) {
      this.gl.deleteBuffer(materialRecord.value);
      materialRecord.value = createMaterialUniform(this.gl);
    }

    if (!sceneCache.has(material)) {
      materialRecord.refs++;
      sceneCache.set(shader, materialRecord);
    }

    let materialQueue = shaderQueue.get(shaderRecord.value);

    if (!materialQueue) {
      materialQueue = new Map();
      shaderQueue.set(materialRecord.value, materialQueue);
    }

    // TODO: We need some way to include Textures in the render queue
  }

  private hasRecordChaned(key: Observable, sceneCache: WeakMap<any, CacheRecord>): boolean {
    const record = sceneCache.get(key);

    if (!record) {
      sceneCache.set(key, { value: null, stateID: key.stateID, refs: -1 });
      return true;
    } else if (key.stateID !== record.stateID) {
      record.stateID = key.stateID;
      return true;
    }

    return false;
  }
}
