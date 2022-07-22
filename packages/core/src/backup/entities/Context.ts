import { MeshPrimitive } from "./MeshPrimitive";

export class Context {
  private gl: WebGL2RenderingContext;

  private cache: Map<number, object> = new Map();

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

  public createVertexArray(primitive: MeshPrimitive): WebGLVertexArrayObject {
    let vertexArray: WebGLVertexArrayObject | undefined = this.cache.get(primitive.getCacheKey());

    if (!vertexArray) {

    }
  }



  public createTexture(): WebGLTexture {

  }

  public createArrayBuffer(): WebGLBuffer {

  }

  public createElementBuffer(): WebGLBuffer {

  }

  public createMaterialBuffer(): WebGLBuffer {

  }

  public bindVertexArrayAttrib(): void {

  }
}