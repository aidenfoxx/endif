import { Material } from "./Material";

function createAttribBuffer(
  gl: WebGL2RenderingContext,
  data: Float32Array,
  attrib: number,
  stride: number
): WebGLBuffer {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('Failed to create mesh buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attrib, stride, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attrib);

  return buffer;
}

export class Mesh {
  public material: Material;

  public vertices: Float32Array;

  public normals?: Float32Array;

  public uvs?: Float32Array;

  public indices?: Uint16Array;

  private vertexArrayCache: Map<WebGL2RenderingContext, WebGLVertexArrayObject> = new Map();

  constructor(
    material: Material,
    vertices: Float32Array,
    uvs?: Float32Array,
    normals?: Float32Array,
    indices?: Uint16Array
  ) {
    this.material = material;
    this.vertices = vertices;
    this.uvs = uvs;
    this.normals = normals;
    this.indices = indices;
  }

  public bind(gl: WebGL2RenderingContext): void {
    let vao: WebGLVertexArrayObject | null | undefined = this.vertexArrayCache.get(gl);

    if (vao) {
      gl.bindVertexArray(vao);
      return;
    }

    vao = gl.createVertexArray();

    if (!vao) {
      throw new Error('Failed to create vertex array');
    }
  
    gl.bindVertexArray(vao);
  
    let vertexBuffer;
    let uvBuffer;
    let normalBuffer;
    let indexBuffer;
  
    try {
      vertexBuffer = createAttribBuffer(gl, this.vertices, 0, 3);
      uvBuffer = createAttribBuffer(gl, this.uvs ?? new Float32Array(), 1, 2);
      normalBuffer = createAttribBuffer(gl, this.normals ?? new Float32Array(), 2, 3);
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
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices ?? new Uint16Array(), gl.STATIC_DRAW);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Force buffer to be destroyed with the vao
    gl.deleteBuffer(vertexBuffer);
    gl.deleteBuffer(uvBuffer);
    gl.deleteBuffer(normalBuffer);
    gl.deleteBuffer(indexBuffer);

    this.vertexArrayCache.set(gl, vao);
  }
}
