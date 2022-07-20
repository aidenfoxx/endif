export enum ShaderType {
  VERTEX = WebGL2RenderingContext.VERTEX_SHADER,
  FRAGMENT = WebGL2RenderingContext.FRAGMENT_SHADER
}

function compileShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error('Failed to create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    console.error('Failed to compile shader', gl.getShaderInfoLog(shader));
    throw new Error('Failed to compile shader');
  }

  return shader;
}

export class Shader {
  public readonly vertexBuffer: string;

  public readonly fragmentBuffer: string;

  private programCache: Map<WebGL2RenderingContext, WebGLProgram> = new Map();

  constructor(vertexBuffer: string, fragmentBuffer: string) {
    this.vertexBuffer = vertexBuffer;
    this.fragmentBuffer = fragmentBuffer;
  }

  public bind(gl: WebGL2RenderingContext): void {
    let program: WebGLProgram | undefined | null = this.programCache.get(gl);

    if (program) {
      gl.linkProgram(program);
      return;
    }

    let vertexShader;
    let fragmentShader;
  
    try {
      vertexShader = compileShader(gl, ShaderType.VERTEX, this.vertexBuffer);
      fragmentShader = compileShader(gl, ShaderType.FRAGMENT, this.fragmentBuffer);
    } catch (e) {
      gl.deleteShader(vertexShader ?? null);
      throw e;
    }
  
    program = gl.createProgram();
  
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new Error('Failed to create shader program');
    }
  
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // Force shaders to be destroyed with the program
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      throw new Error('Failed to link shader');
    }

    this.programCache.set(gl, program);
  }
}
