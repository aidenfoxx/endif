import { BufferType } from '../../types';

export function createArrayBuffer(
  gl: WebGL2RenderingContext,
  bufferType: BufferType,
  buffer: ArrayBuffer
): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, buffer, gl.STATIC_DRAW);
  gl.bindBuffer(bufferType, null);

  return buffer;
}

export function createVertexArray(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();

  if (!vao) {
    throw new Error('Failed to create vertex array');
  }

  return vao;
}
