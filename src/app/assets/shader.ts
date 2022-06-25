import { RefCounter } from '../types';
import { resolvePath } from '../utils/resolve-path';

export interface ShaderRef {
  readonly vertexPath: string;
  readonly fragmentPath: string;
  readonly program: WebGLProgram;
}

const shaderCache: Map<string, Map<string, RefCounter<ShaderRef>>> = new Map();

async function createShader(gl: WebGL2RenderingContext, path: string, type: number): Promise<WebGLShader> {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error(`Failed to create shader`);
  }

  const response = await fetch(path);

  gl.shaderSource(shader, await response.text());
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Failed to compile shader: ${path}`, gl.getShaderInfoLog(shader));
    throw new Error(`Failed to compile shader: ${path}`);
  }

  return shader;
};

export async function shaderFetch(gl: WebGL2RenderingContext, vertexPath: string, fragmentPath: string): Promise<ShaderRef> {
  vertexPath = resolvePath(vertexPath);
  fragmentPath = resolvePath(fragmentPath);

  const refCounter = shaderCache.get(vertexPath)?.get(fragmentPath);

  if (refCounter) {
    refCounter.refs++;
    return refCounter.resource;
  }

  const program = gl.createProgram();

  if (!program) {
    throw new Error(`Failed to create shader program`);
  }

  const [vertexShader, fragmentShader] = await Promise.all([
    createShader(gl, vertexPath, gl.VERTEX_SHADER),
    createShader(gl, fragmentPath, gl.FRAGMENT_SHADER)
  ]);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  // Force shaders to be destroyed with the program
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Failed to link shader');
  }

  const programRef = { vertexPath, fragmentPath, program };

  if (!shaderCache.get(vertexPath)) {
    shaderCache.set(vertexPath, new Map());
  }

  shaderCache.get(vertexPath)!.set(fragmentPath, { refs: 1, resource: programRef });

  return programRef;
}

export function shaderDestroy(gl: WebGL2RenderingContext, shaderRef: ShaderRef): void {
  const { vertexPath, fragmentPath } = shaderRef;
  const refCounter = shaderCache.get(vertexPath)?.get(fragmentPath);

  if (!refCounter) {
    console.warn(`Shader could not be destroyed. Not defined: ${vertexPath}, ${fragmentPath}`);
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteProgram(refCounter.resource.program);
    shaderCache.get(vertexPath)!.delete(fragmentPath);
  } else {
    refCounter.refs--;
  }
}
