import { Scene } from "../entities/Scene";
import { mat4Multiply } from "../utils/math";
import { createProgram } from "../utils/renderer/shader";
import { Camera } from "../entities/camera/Camera";
import { bindVertexArrayAttrib, bindVertexArrayElementBuffer, createArrayBuffer, createVertexArray } from "../utils/renderer/mesh";
import { DataBuffer } from "../entities/buffer/BufferView";
import { Mesh } from "../entities/Mesh";
import { BufferType } from "../types";
import { Material } from "../entities/Material";
import { MeshBuffers, MeshPrimitive } from "../entities/MeshPrimitive";
import { TextureBuffer } from "../entities/buffer/TextureBuffer";

interface CacheRecord<T> {
  cacheKey: number;
  value: T;
  refs: number;
}

export class Renderer {
  private gl: WebGL2RenderingContext;

  private sceneCache: WeakMap<Scene, Map<object, object>> = new WeakMap();

  private meshBufferCache: Map<MeshBuffers, CacheRecord<WebGLBuffer>> = new Map();
  private textureBufferCache: Map<TextureBuffer, CacheRecord<WebGLTexture>> = new Map();
  private meshCache: Map<MeshPrimitive, CacheRecord<WebGLVertexArrayObject>> = new Map();
  private materialCache: Map<Material, CacheRecord<WebGLBuffer>> = new Map();

  constructor(public readonly canvas: HTMLElement, options?: WebGLContextAttributes) {
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
    // Fetch cache container
    let sceneCache = this.sceneCache.get(scene);

    if (!sceneCache) {
      sceneCache = new Map();
      this.sceneCache.set(scene, sceneCache);
    }

    // Render meshes
    for (let i = 0; i < scene.meshes.length; i++)  {
      this.renderMesh(scene.meshes[i], camera, sceneCache);
    }

    this.gl.useProgram(null);
  }

  private renderMesh(mesh: Mesh, camera: Camera, sceneCache: Map<object, object>): void {

    for (let i = 0; i < mesh.primitives.length; i++) {
      const meshPrimitive = mesh.primitives[i];

      // Bind shader
      let program = sceneCache.get(meshPrimitive.material.shader) as WebGLProgram | undefined;

      if (!program) {
        program = createProgram(
          this.gl,
          meshPrimitive.material.shader.vertexSource,
          meshPrimitive.material.shader.fragmentSource
        );
        sceneCache.set(meshPrimitive.material.shader, program);
      }

      this.gl.useProgram(program);

      const modelLocation = this.gl.getUniformLocation(program, 'model');
      const viewLocation = this.gl.getUniformLocation(program, 'view');
      const modelViewLocation = this.gl.getUniformLocation(program, 'modelView');
      const projectionLocation = this.gl.getUniformLocation(program, 'projection');

      this.gl.uniformMatrix4fv(modelLocation, false, new Float32Array(mesh.matrix));
      this.gl.uniformMatrix4fv(viewLocation, false, new Float32Array(camera.matrix));
      this.gl.uniformMatrix4fv(
        modelViewLocation,
        false,
        new Float32Array(mat4Multiply(camera.matrix, mesh.matrix))
      );
      this.gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(camera.projection));

      // Bind vertex array
      let vertexArray = sceneCache.get(meshPrimitive) as WebGLVertexArrayObject | undefined;
  
      if (!vertexArray) {
        vertexArray = createVertexArray(this.gl)

        this.bindVertexArrayAttrib(vertexArray, meshPrimitive.positions, 0, sceneCache);

        if (meshPrimitive.normals) {
          this.bindVertexArrayAttrib(vertexArray, meshPrimitive.normals, 1, sceneCache);
        }

        if (meshPrimitive.texCoords0) {
          this.bindVertexArrayAttrib(vertexArray, meshPrimitive.texCoords0, 2, sceneCache);
        }

        if (meshPrimitive.texCoords1) {
          this.bindVertexArrayAttrib(vertexArray, meshPrimitive.texCoords1, 3, sceneCache);
        }

        if (meshPrimitive.texCoords2) {
          this.bindVertexArrayAttrib(vertexArray, meshPrimitive.texCoords2, 4, sceneCache);
        }

        if (meshPrimitive.texCoords3) {
          this.bindVertexArrayAttrib(vertexArray, meshPrimitive.texCoords3, 5, sceneCache);
        }

        if (meshPrimitive.indices) {
          this.bindVertexArrayElementBuffer(vertexArray, meshPrimitive.indices, sceneCache)
        }

        sceneCache.set(meshPrimitive, vertexArray);
      }

      this.gl.bindVertexArray(vertexArray);

      // Bind material
      const material = meshPrimitive.material;

      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.diffuseTexture ?? null);

      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.metallicRoughnessTexture ?? null);

      this.gl.activeTexture(this.gl.TEXTURE2);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.normalTexture ?? null);

      this.gl.activeTexture(this.gl.TEXTURE3);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.occlusionTexture ?? null);

      this.gl.activeTexture(this.gl.TEXTURE4);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.emissiveTexture ?? null);
    }
  }

  private bindVertexArrayAttrib(
    vertexArray: WebGLVertexArrayObject,
    dataBuffer: DataBuffer,
    index: number,
    sceneCache: Map<object, object>
  ): void {
    let buffer = sceneCache.get(dataBuffer.buffer) as WebGLBuffer | undefined;

    if (!buffer) {
      buffer = createArrayBuffer(this.gl, BufferType.ARRAY_BUFFER, dataBuffer.buffer);
      sceneCache.set(dataBuffer.buffer, buffer);
    }

    bindVertexArrayAttrib(
      this.gl,
      vertexArray,
      buffer,
      index,
      dataBuffer.count,
      dataBuffer.dataType,
      dataBuffer.byteStride,
      dataBuffer.byteOffest,
      dataBuffer.normalized
    );
  }

  private bindVertexArrayElementBuffer(
    vertexArray: WebGLVertexArrayObject,
    dataBuffer: ArrayBuffer,
    sceneCache: Map<object, object>
  ): void {
    let buffer = sceneCache.get(dataBuffer) as WebGLBuffer | undefined;

    if (!buffer) {
      buffer = createArrayBuffer(this.gl, BufferType.ELEMENT_ARRAY_BUFFER, dataBuffer);
      sceneCache.set(dataBuffer, buffer);
    }

    bindVertexArrayElementBuffer(this.gl, vertexArray, dataBuffer);
  }
}