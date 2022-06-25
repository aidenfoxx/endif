import { Mesh } from '../../core/entities/mesh';
import { objParse } from '../../core/utils/mesh/obj';
import { RefCounter } from '../types';
import { resolvePath } from '../utils/resolve-path';

export interface MeshRef {
  readonly path: string;
  readonly vao: WebGLVertexArrayObject;
  readonly mesh: Mesh;
}

const EXTENSION_OBJ = 'obj';

const meshCache: Map<string, RefCounter<MeshRef>> = new Map();

function createAttribBuffer(gl: WebGL2RenderingContext, data: ReadonlyArray<number>, attrib: number, stride: number): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attrib, stride, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attrib);

  return buffer;
}

export async function meshFetch(gl: WebGL2RenderingContext, path: string): Promise<MeshRef> {
  path = resolvePath(path);

  const refCounter = meshCache.get(path);

  if (refCounter) {
    refCounter.refs++;
    return refCounter.resource;
  }

  const extension = path.split('.').pop();

  if (extension?.toLowerCase() !== EXTENSION_OBJ) {
    throw new Error(`Unsupported mesh format: ${extension}`)
  }

  const response = await fetch(path);
  const mesh = objParse(await response.text());
  const vao = gl.createVertexArray();

  if (!vao) {
    throw new Error('Failed to create vertex array');
  }

  gl.bindVertexArray(vao);

  const vertexBuffer = createAttribBuffer(gl, mesh.vertices, 0, 3);
  const uvBuffer = createAttribBuffer(gl, mesh.uvs, 1, 2);
  const normalBuffer = createAttribBuffer(gl, mesh.normals, 2, 3);
  const indexBuffer = gl.createBuffer();

  if (!indexBuffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
  // Force buffer to be destroyed with the vao
  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(uvBuffer);
  gl.deleteBuffer(normalBuffer);
  gl.deleteBuffer(indexBuffer);

  const meshRef = { path, mesh, vao };

  meshCache.set(path, { refs: 1, resource: meshRef });

  return meshRef;
}

export function meshDestroy(gl: WebGL2RenderingContext, meshRef: MeshRef): void {
  const { path } = meshRef;
  const refCounter = meshCache.get(path);

  if (!refCounter) {
    console.warn(`Mesh could not be destroyed. Not defined: ${path}`);
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteVertexArray(refCounter.resource.vao);
    meshCache.delete(path);
  } else {
    refCounter.refs--;
  }
}
