import { BufferType } from '../../types';

export function createUniformBuffer(gl: WebGL2RenderingContext, size: number): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create uniform buffer')
  }

  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
  gl.bufferData(gl.UNIFORM_BUFFER, size, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.UNIFORM_BUFFER, null);

  return buffer;
}

export function createArrayBuffer(
  gl: WebGL2RenderingContext,
  data: ArrayBuffer,
  target: BufferType,
  byteLength: number,
  byteOffest: number = 0
): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, new Uint8Array(data), gl.STATIC_DRAW, byteOffest, byteLength);
  gl.bindBuffer(target, null);

  return buffer;
}

export function createVertexArray(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();

  if (!vao) {
    throw new Error('Failed to create vertex array');
  }

  return vao;
}
