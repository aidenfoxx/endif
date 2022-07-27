import { Scene } from './Scene';
import { Camera } from './camera/Camera';
import { Mesh } from './mesh/Mesh';
import { BufferKey, MeshPrimitive } from './mesh/MeshPrimitive';
import { createProgram } from '../utils/gl/shader';
import { createMaterialUniform } from '../utils/gl/material';
import { aabbTransform } from '../utils/math';
import { AssetCache } from './cache/AssetCache';
import { VisbilityCache } from './cache/VisibilityCache';
import { Material, TextureKey } from './material/Material';
import { Shader } from './shader/Shader';
import { createTexture } from '../utils/gl/textures';
import { createArrayBuffer, createVertexArray } from '../utils/gl/mesh';

type RenderQueue = Map<Shader, Map<Material, Map<Mesh, Array<MeshPrimitive>>>>;

export class Renderer {
  private gl: WebGL2RenderingContext;

  private sceneAssets: Map<Scene, AssetCache> = new Map();
  private sceneVisibility: Map<Scene, VisbilityCache> = new Map();

  constructor(canvas: HTMLElement, options?: WebGLContextAttributes) {
    if (canvas instanceof HTMLCanvasElement) {
      const gl = canvas.getContext('webgl2', options);

      if (gl) {
        this.gl = gl;
        return;
      }
    }

    throw new Error('Unable to initialize WebGL context');
  }

  public clear(): void {
    this.gl.clearColor(0, 0, 0, 0);
  }

  public renderScene(scene: Scene, camera: Camera): void {
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

          this.parsePrimitive(mesh, primitive, renderQueue);
        }
      }
    } else {
      for (const [_, mesh] of scene.meshes) {
        for (const [_, primitive] of mesh.primitives) {
          this.parsePrimitive(mesh, primitive, renderQueue);
        }
      }
    }

    // Parse render queue
    let assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      assetCache = new AssetCache();
      this.sceneAssets.set(scene, assetCache);
    }

    for (const [shader, materialQueue] of renderQueue) {
      const program = assetCache.getValue(shader, () => {
        return createProgram(this.gl, shader.vertexSource, shader.fragmentSource);
      });
  
      this.gl.useProgram(program);

      const modelLocation = this.gl.getUniformLocation(program, 'model');
      const viewLocation = this.gl.getUniformLocation(program, 'view');
      const projectionLocation = this.gl.getUniformLocation(program, 'projection');

      this.gl.uniformMatrix4fv(viewLocation, false, new Float32Array(camera.getMatrix()));
      this.gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(camera.getProjection()));

      for (const [material, meshQueue] of materialQueue) {
        this.bindMaterial(material, assetCache);

        for (const [mesh, primitiveArray] of meshQueue) {
          this.gl.uniformMatrix4fv(modelLocation, false, new Float32Array(mesh.getMatrix()));

          for (let i = 0; i < primitiveArray.length; i++) {
            const primitive = primitiveArray[i];
            const bufferView = primitiveArray[i].buffers[BufferKey.INDEX]
              ?? primitiveArray[i].buffers[BufferKey.POSITION];

            this.bindPrimitive(primitive, assetCache);
            this.gl.drawElements(primitive.mode, bufferView.size, bufferView.type, 0);// TODO: This only works with indices?
          }
        }
      }
    }
  }

  public releaseScene(scene: Scene): void {
    let assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      return;
    }

    for (const [key, value] of assetCache) {
      // TODO: Cleanup assets
    }
  }

  private parsePrimitive(
    mesh: Mesh,
    primitive: MeshPrimitive,
    renderQueue: RenderQueue
  ): void {
    let materialQueue = renderQueue.get(primitive.material.shader);

    if (!materialQueue) {
      materialQueue = new Map();
      renderQueue.set(primitive.material.shader, materialQueue);
    }

    let meshQueue = materialQueue.get(primitive.material);

    if (!meshQueue) {
      meshQueue = new Map();
      materialQueue.set(primitive.material, meshQueue);
    }

    let primitiveArray = meshQueue.get(mesh);

    if (!primitiveArray) {
      primitiveArray = new Array();
      meshQueue.set(mesh, primitiveArray);
    }

    primitiveArray.push(primitive);
  }

  private bindMaterial(material: Material, assetCache: AssetCache): void {
    const materialBuffer = assetCache.observeValue(material, (previousMaterial?: WebGLProgram) => {
      if (previousMaterial) {
        this.gl.deleteBuffer(previousMaterial);
      }
      return createMaterialUniform(this.gl);
    });
    
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, materialBuffer);

    // Bind textures
    const textureKeys = Object.keys(TextureKey).map(Number).filter(key => isNaN(key));

    for (const key of textureKeys) {
      this.gl.activeTexture(this.gl.TEXTURE0 + key);

      const texture = material.textures[key as TextureKey];

      if (!texture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        continue;
      }

      const buffer = assetCache.getValue(texture, () => { // TODO: Fix naming
        const buffer = createTexture(this.gl, texture.image);

        this.gl.bindTexture(this.gl.TEXTURE_2D, buffer);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, texture.minFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, texture.magFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, texture.wrapS);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, texture.wrapT);

        return buffer;
      })

      this.gl.bindTexture(this.gl.TEXTURE_2D, buffer);
    }
  }

  private bindPrimitive(primitive: MeshPrimitive, assetCache: AssetCache): void {
    const vertexArray = assetCache.observeValue(primitive, (previousVertexArray?: WebGLProgram) => {
      if (previousVertexArray) {
        this.gl.deleteVertexArray(previousVertexArray);
      }

      const vertexArray = createVertexArray(this.gl);
      
      this.gl.bindVertexArray(vertexArray);

      // Bind buffers
      const bufferViewKeys = Object.keys(BufferKey).map(Number).filter(key => isNaN(key));

      for (const key of bufferViewKeys) {
        const bufferView = primitive.buffers[key as BufferKey];

        if (!bufferView) {
          continue;
        }

        const isIndexBuffer = Number(key) === BufferKey.INDEX;
        const buffer = assetCache.getValue(bufferView.buffer, () => {
          return createArrayBuffer(
            this.gl,
            bufferView.buffer.data,
            bufferView.buffer.target,
            bufferView.buffer.byteLength,
            bufferView.buffer.byteOffest
          );
        })

        if (isIndexBuffer) {
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        } else {
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
          this.gl.vertexAttribPointer(
            Number(key),
            bufferView.count,
            bufferView.type,
            bufferView.normalized,
            bufferView.byteStride,
            bufferView.byteOffest
          );
        }
      }

      return vertexArray;
    });

    this.gl.bindVertexArray(vertexArray);
  }
}
