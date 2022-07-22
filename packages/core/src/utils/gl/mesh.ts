import { BufferType, DataType } from '../../types';

export function createArrayBuffer(
  gl: WebGL2RenderingContext,
  bufferType: BufferType,
  data: ArrayBuffer // TODO: Fix the naming to match Renderer
): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, data, gl.STATIC_DRAW);
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

export function bindVertexArrayAttrib(
  gl: WebGL2RenderingContext,
  vertexArray: WebGLVertexArrayObject,
  buffer: WebGLBuffer,
  index: number,
  count: number,
  dataType: DataType,
  byteStride: number,
  byteOffest: number,
  normalized: boolean
): void {
  gl.bindVertexArray(vertexArray);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(index, count, dataType, normalized, byteStride, byteOffest);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindVertexArray(null);
}

export function bindVertexArrayElementBuffer(
  gl: WebGL2RenderingContext,
  vertexArray: WebGLVertexArrayObject,
  buffer: WebGLBuffer
): void {
  gl.bindVertexArray(vertexArray);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bindVertexArray(null);
}
