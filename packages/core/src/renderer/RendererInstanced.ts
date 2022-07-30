import { Scene } from './Scene';
import { Camera } from './cameras/Camera';
import { Mesh } from './meshes/Mesh';
import { BufferKey, MeshPrimitive } from './meshes/MeshPrimitive';
import { createProgram } from '../utils/gl/shader';
import { aabbTransform } from '../utils/math';
import { AssetCache } from './caches/AssetCache';
import { VisbilityCache } from './caches/VisibilityCache';
import { Material, TextureKey } from './materials/Material';
import { Shader } from './shaders/Shader';
import { createTexture } from '../utils/gl/texture';
import { createArrayBuffer, createUniformBuffer, createVertexArray } from '../utils/gl/buffer';
import { Texture } from './textures/Texture';
import { BufferType, DataType } from '../types';

type RenderQueue = Map<Shader, Map<Material, Map<MeshPrimitive, Set<Mesh>>>>;

const CAMERA_BUFFER_INDEX = 0;
const MATERIAL_BUFFER_INDEX = 1;
const INSTANCED_DRAWS_MAX = 100000;

const renderedElement = document.getElementById('rendered')!;
let rendered = 0;
let notRendered = 0;
let drawCalls = 0;

export class RendererInstanced {
  private gl: WebGL2RenderingContext;

  private sceneAssets: Map<Scene, AssetCache> = new Map();
  private sceneVisibility: Map<Scene, VisbilityCache> = new Map();

  private modelMatrixBuffer;

  constructor(canvas: HTMLElement, options?: WebGLContextAttributes) {
    if (canvas instanceof HTMLCanvasElement) {
      const gl = canvas.getContext('webgl2', options);

      if (gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        const modelMatrixBuffer = gl.createBuffer();

        if (!modelMatrixBuffer) {
          throw new Error('Failed to create matrix buffer');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, modelMatrixBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, 64 * INSTANCED_DRAWS_MAX, gl.DYNAMIC_DRAW);

        this.modelMatrixBuffer = modelMatrixBuffer;
        this.gl = gl;

        return;
      }
    }

    throw new Error('Failed to initialize WebGL context');
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

      //const hasCameraChanged = visiblityCache.observeChange(camera);

      for (const mesh of scene.meshes.values()) {
        //const hasMeshChanged = visiblityCache.observeChange(mesh);

        for (const primitive of mesh.primitives.values()) {
          //const hasPrimitiveChanged = visiblityCache.observeChange(primitive);
          //const hasChanged = hasCameraChanged || hasMeshChanged || hasPrimitiveChanged;

          // Reuse previous visibility if nothing changed
          //let isVisible = visiblityCache.getVisibility(primitive);

          // TODO: This doesn't work. Needs to be cached WITH the mesh which contains the transform.

          //if (hasChanged || isVisible === undefined) {
            const aabb = aabbTransform(primitive.getAABB(), mesh.getMatrix());
            const isVisible = camera.isVisible(aabb);
            //visiblityCache.setVisbility(primitive, isVisible);
          //}

          if (!isVisible) {
            notRendered++;
            continue;
          }

          rendered++;

          this.parsePrimitive(mesh, primitive, renderQueue);
        }
      }
    } else {
      for (const mesh of scene.meshes.values()) {
        for (const primitive of mesh.primitives.values()) {
          this.parsePrimitive(mesh, primitive, renderQueue);
        }
      }
    }

    renderedElement.innerHTML = `Drawn: ${rendered}, Not Drawn: ${notRendered}, Draw calls: ${drawCalls}`;
    rendered = 0;
    notRendered = 0;
    drawCalls = 0;

    // Parse render queue
    let assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      assetCache = new AssetCache();
      this.sceneAssets.set(scene, assetCache);
    }

    // Bind camera UBO
    const cameraBuffer = assetCache.observeValue(camera, (previousBuffer?: WebGLBuffer) => {
      const buffer = previousBuffer ?? createUniformBuffer(this.gl, 192);

      this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, buffer);
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 64, new Float32Array(camera.getMatrix()));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 128, new Float32Array(camera.getProjection()));

      return buffer;
    });

    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, CAMERA_BUFFER_INDEX, cameraBuffer);

    for (const [shader, materialQueue] of renderQueue) {
      // Bind shader
      const program = assetCache.getValue(shader, () => {
        const program = createProgram(this.gl, shader.vertexSource, shader.fragmentSource);
        const cameraBlockIndex = this.gl.getUniformBlockIndex(program, 'Camera');
        const materialBlockIndex = this.gl.getUniformBlockIndex(program, 'Material');

        this.gl.uniformBlockBinding(program, cameraBlockIndex, CAMERA_BUFFER_INDEX);
        this.gl.uniformBlockBinding(program, materialBlockIndex, MATERIAL_BUFFER_INDEX);

        return program;
      });

      this.gl.useProgram(program);

      for (const [material, primitiveQueue] of materialQueue) {
        this.bindMaterial(material, assetCache);

        // Rebind the camera to update model matrix
        //this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, cameraBuffer);

        for (const [primitive, meshQueue] of primitiveQueue) {
          this.bindPrimitive(primitive, assetCache);
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.modelMatrixBuffer);

          // Bind matrix to model matrix buffer
          let index = 0;
          
          for (const mesh of meshQueue) {
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, index * 64, new Float32Array(mesh.getMatrix()));
            index++;
          }

          // Instanced draw
          const indexBuffer = primitive.buffers[BufferKey.INDEX];

          if (indexBuffer) {
            this.gl.drawElementsInstanced(primitive.mode, indexBuffer.count, indexBuffer.type, 0, meshQueue.size);
          } else {
            const positionBuffer = primitive.buffers[BufferKey.POSITION];
            this.gl.drawArraysInstanced(primitive.mode, 0, positionBuffer.count, meshQueue.size);
          }

          drawCalls++;
        }
      }
    }
  }

  public releaseScene(scene: Scene): void {
    const assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      return;
    }

    for (const key of assetCache.keys()) {
      if (key instanceof Camera || key instanceof Material || key instanceof Buffer) {
        assetCache.deleteValue(key, (value: WebGLBuffer) => {
          this.gl.deleteBuffer(value);
        });
      } else if (key instanceof Shader) {
        assetCache.deleteValue(key, (value: WebGLProgram) => {
          this.gl.deleteProgram(value);
        });
      } else if (key instanceof Texture) {
        assetCache.deleteValue(key, (value: WebGLTexture) => {
          this.gl.deleteTexture(value);
        });
      } else if (key instanceof MeshPrimitive) {
        assetCache.deleteValue(key, (value: WebGLVertexArrayObject) => {
          this.gl.deleteVertexArray(value);
        });
      }
    }
  }

  public releaseTexture(scene: Scene, texture: Texture): void {
    const assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      return;
    }

    assetCache.deleteValue(texture, (value: WebGLTexture) => {
      this.gl.deleteTexture(value);
    });
  }

  public releaseBuffer(scene: Scene, buffer: Buffer): void {
    const assetCache = this.sceneAssets.get(scene);

    if (!assetCache) {
      return;
    }

    assetCache.deleteValue(buffer, (value: WebGLTexture) => {
      this.gl.deleteBuffer(value);
    });
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

  private bindMaterial(material: Material, assetCache: AssetCache): void {
    const materialBuffer = assetCache.observeValue(material, (previousBuffer?: WebGLProgram) => {
      const buffer = previousBuffer ?? createUniformBuffer(this.gl, 48);

      this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, buffer);
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, new Float32Array(material.diffuseFactor));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 16, new Float32Array(material.metallicFactor));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 20, new Float32Array(material.roughnessFactor));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 32, new Float32Array(material.emissiveFactor));

      return buffer;
    });

    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, MATERIAL_BUFFER_INDEX, materialBuffer);

    // Bind textures
    const textureKeys = Object.keys(TextureKey)
      .map(Number)
      .filter((key) => !isNaN(key));

    for (const key of textureKeys) {
      this.gl.activeTexture(this.gl.TEXTURE0 + key);

      const texture = material.textures[key as TextureKey];

      if (!texture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        continue;
      }

      const buffer = assetCache.getValue(texture, () => {
        const buffer = createTexture(this.gl, texture.image);

        this.gl.bindTexture(this.gl.TEXTURE_2D, buffer);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, texture.minFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, texture.magFilter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, texture.wrapS);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, texture.wrapT);

        return buffer;
      });

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
      const bufferViewKeys = Object.keys(BufferKey)
        .map(Number)
        .filter((key) => !isNaN(key));

      for (const key of bufferViewKeys) {
        const bufferView = primitive.buffers[key as BufferKey];

        if (!bufferView) {
          continue;
        }

        const buffer = assetCache.getValue(bufferView.buffer, () => {
          return createArrayBuffer(
            this.gl,
            bufferView.buffer.data,
            bufferView.buffer.target,
            bufferView.buffer.byteLength,
            bufferView.buffer.byteOffest
          );
        });

        this.gl.bindBuffer(bufferView.buffer.target, buffer);

        if (key !== BufferKey.INDEX) {
          this.gl.enableVertexAttribArray(key);
          this.gl.vertexAttribPointer(
            key,
            bufferView.size,
            bufferView.type,
            bufferView.normalized,
            bufferView.byteStride,
            bufferView.byteOffest
          );
        }

        // Instanced matrix buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.modelMatrixBuffer);

        for (let i = 0; i < 4; i++) {
          this.gl.enableVertexAttribArray(10 + i);
          this.gl.vertexAttribDivisor(10 + i, 1);
          this.gl.vertexAttribPointer(10 + i, 4, DataType.FLOAT, false, 64, i * 16);
        }
      }

      return vertexArray;
    });

    this.gl.bindVertexArray(vertexArray);
  }
}
