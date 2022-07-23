import { Scene } from './Scene';
import { Camera } from './cameras/Camera';
import { Mesh } from './meshes/Mesh';
import { MeshPrimitive } from './meshes/MeshPrimitive';
import { createProgram } from '../utils/gl/shader';
import { createMaterialUniform } from '../utils/gl/material';
import { aabbTransform } from '../utils/math';
import { RendererCache } from './RendererCache';

type RenderQueue = Map<WebGLProgram, Map<WebGLBuffer, Map<WebGLVertexArrayObject, Mesh>>>;

export class Renderer {
  private gl: WebGL2RenderingContext;

  private sceneCaches: Map<Scene, RendererCache> = new Map();

  /* TODO: Remove
    //private sceneVisibility: Map<Scene, WeakMap<Camera, WeakMap<MeshPrimitive, boolean>>> = new Map();
    //private sceneVisibility: Map<Scene, WeakMap<object, VisibilityRecord>> = new Map();
  */

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
    let cache = this.sceneCaches.get(scene);

    if (!cache) {
      cache = new RendererCache();
      this.sceneCaches.set(scene, cache);
    }

    // Generate render queue
    const renderQueue: RenderQueue = new Map();
    
    if (camera.frustumCulling) {
      let sceneVisibility = this.sceneVisibility.get(scene);

      if (!sceneVisibility) {
        sceneVisibility = new WeakMap();
        this.sceneVisibility.set(scene, sceneVisibility);
      }

      const hasCameraChanged = this.hasRecordChaned(camera, sceneVisibility);

      for (const [_, mesh] of scene.meshes) {
        const hasMeshChanged = this.hasRecordChaned(mesh, sceneVisibility);

        for (const [_, primitive] of mesh.primitives) {
          const hasPrimitiveChanged = this.hasRecordChaned(primitive, sceneVisibility);
          const hasChanged = hasCameraChanged || hasMeshChanged || hasPrimitiveChanged;

          // Reuse previous visibility if nothing changed
          const visibilityRecord = sceneVisibility.get(primitive);

          // TODO: Can we combine this in the response from "hasRecordChaned"? E.g. do we need to fetch it?
          if (!visibilityRecord!.value && !hasChanged) {
            continue;
          }

          const aabb = aabbTransform(primitive.getAABB(), mesh.getMatrix());
          const isVisible = camera.isVisible(aabb);

          visibilityRecord!.value = isVisible;

          if (isVisible) {
            this.parsePrimitive(primitive, renderQueue, cache);
          }
        }
      }
    } else {
      for (const [_, mesh] of scene.meshes) {
        for (const [_, primitive] of mesh.primitives) {
          this.parsePrimitive(primitive, renderQueue, cache);
        }
      }
    }

    // Handle render queue
  }

  private parsePrimitive(
    primitive: MeshPrimitive,
    renderQueue: RenderQueue,
    cache: RendererCache
  ): void {
    const material = primitive.material;
    const shader = material.shader;

    // Add shader to queue
    const program = cache.getValue(shader, () => {
      return createProgram(this.gl, shader.vertexSource, shader.fragmentSource);
    });

    let shaderQueue = renderQueue.get(program);

    if (!shaderQueue) {
      shaderQueue = new Map();
      renderQueue.set(program, shaderQueue);
    }

    // Add material to queue
    const materialBuffer = cache.observeValue(material, (previousMaterial?: WebGLProgram) => {
      if (previousMaterial) {
        this.gl.deleteBuffer(previousMaterial);
      }
      return createMaterialUniform(this.gl);
    });

    let materialQueue = shaderQueue.get(materialBuffer);

    if (!materialQueue) {
      materialQueue = new Map();
      shaderQueue.set(materialBuffer, materialQueue);
    }

    // TODO: We need some way to include Textures in the render queue
  }

  /*private hasRecordChaned(key: Observable, sceneCache: WeakMap<any, VisibilityRecord>): boolean {
    const record = sceneCache.get(key);

    if (!record) {
      sceneCache.set(key, { value: false, stateID: key.stateID });
      return true;
    } else if (key.stateID !== record.stateID) {
      record.stateID = key.stateID;
      return true;
    }

    return false;
  }*/
}
