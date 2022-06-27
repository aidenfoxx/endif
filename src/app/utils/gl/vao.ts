import { Mesh } from '../../../core/entities/mesh';

function createAttribBuffer(
  gl: WebGL2RenderingContext,
  data: ReadonlyArray<number>,
  attrib: number,
  stride: number
): WebGLBuffer {
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

export function vaoCreate(gl: WebGL2RenderingContext, mesh: Mesh): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();

  if (!vao) {
    throw new Error('Failed to create vertex array');
  }

  gl.bindVertexArray(vao);

  let vertexBuffer;
  let uvBuffer;
  let normalBuffer;
  let indexBuffer;

  try {
    vertexBuffer = createAttribBuffer(gl, mesh.vertices, 0, 3);
    uvBuffer = createAttribBuffer(gl, mesh.uvs, 1, 2);
    normalBuffer = createAttribBuffer(gl, mesh.normals, 2, 3);
    indexBuffer = gl.createBuffer();

    if (!indexBuffer) {
      throw new Error('Failed to create index buffer');
    }
  } catch (e) {
    gl.deleteVertexArray(vao);
    gl.deleteBuffer(vertexBuffer ?? null);
    gl.deleteBuffer(uvBuffer ?? null);
    gl.deleteBuffer(normalBuffer ?? null);
    throw e;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  // Force buffer to be destroyed with the vao
  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(uvBuffer);
  gl.deleteBuffer(normalBuffer);
  gl.deleteBuffer(indexBuffer);

  return vao;
}
