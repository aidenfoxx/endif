export function createArrayBuffer(gl: WebGL2RenderingContext, data: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;
}

export function createVertexArray(
  gl: WebGL2RenderingContext,
  indices: Uint16Array
): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();

  if (!vao) {
    throw new Error('Failed to create vertex array');
  }

  gl.bindVertexArray(vao);

  const indexBuffer = gl.createBuffer();

  if (!indexBuffer) {
    gl.deleteVertexArray(vao);
    throw new Error('Failed to create index buffer');
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.bindVertexArray(null);

  return vao;
}
