import { Scene } from './Scene';
import { Camera } from './camera/Camera';
import { Mesh } from './meshes/Mesh';
import { MeshPrimitive } from './meshes/MeshPrimitive';
import { createProgram } from '../utils/gl/shader';
import { createMaterialUniform } from '../utils/gl/material';
import { aabbTransform } from '../utils/math';
import { AssetCache } from './cache/AssetCache';
import { VisbilityCache } from './cache/VisibilityCache';

type RenderQueue = Map<WebGLProgram, Map<WebGLBuffer, Map<WebGLVertexArrayObject, Mesh>>>;

export class Renderer {
  private gl: WebGL2RenderingContext;

  private sceneAssets: Map<Scene, AssetCache> = new Map();
  private sceneVisibility: Map<Scene, VisbilityCache> = new Map();

  constructor(canvas: HTMLElement, options?: WebGLContextAttributes) {
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
    let assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      assetCache = new AssetCache();
      this.sceneAssets.set(scene, assetCache);
    }

    // Generate render queue
    const renderQueue: RenderQueue = new Map();
    
    if (camera.frustumCulling) {
      let visiblityCache = this.sceneVisibility.get(scene);

      if (!visiblityCache) {
        visiblityCache = new VisbilityCache();
        this.sceneVisibility.set(scene, visiblityCache);
      }

      let hasChanged = visiblityCache.observeChange(camera);

      for (const [_, mesh] of scene.meshes) {
        hasChanged ||= visiblityCache.observeChange(mesh);

        for (const [_, primitive] of mesh.primitives) {
          hasChanged ||= visiblityCache.observeChange(primitive);

          // Reuse previous visibility if nothing changed
          const wasVisible = visiblityCache.getVisibility(primitive);

          if (hasChanged || wasVisible === undefined) {
            const aabb = aabbTransform(primitive.getAABB(), mesh.getMatrix());
            const isVisible = camera.isVisible(aabb);

            visiblityCache.setVisbility(primitive, isVisible);
          } else if (!wasVisible) {
            continue;
          }

          this.parsePrimitive(primitive, renderQueue, assetCache);
        }
      }
    } else {
      for (const [_, mesh] of scene.meshes) {
        for (const [_, primitive] of mesh.primitives) {
          this.parsePrimitive(primitive, renderQueue, assetCache);
        }
      }
    }

    // Handle render queue
  }

  private parsePrimitive(
    primitive: MeshPrimitive,
    renderQueue: RenderQueue,
    assetCache: AssetCache
  ): void {
    const material = primitive.material;
    const shader = material.shader;

    // Add shader to queue
    const program = assetCache.getValue(shader, () => {
      return createProgram(this.gl, shader.vertexSource, shader.fragmentSource);
    });

    let shaderQueue = renderQueue.get(program);

    if (!shaderQueue) {
      shaderQueue = new Map();
      renderQueue.set(program, shaderQueue);
    }

    // Add material to queue
    const materialBuffer = assetCache.observeValue(material, (previousMaterial?: WebGLProgram) => {
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

    // Add textures to queue
  }
}
