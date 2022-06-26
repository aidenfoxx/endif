import { RefCounter } from '../types';
import { resolvePath } from '../utils/resolve-path';

export interface ShaderRef {
  readonly vertexPath: string;
  readonly fragmentPath: string;
  readonly program: WebGLProgram;
}

const shaderCache: Map<string, Map<string, RefCounter<ShaderRef>>> = new Map();

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
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

export async function shaderFetch(
  gl: WebGL2RenderingContext,
  vertexPath: string,
  fragmentPath: string
): Promise<ShaderRef> {
  vertexPath = resolvePath(vertexPath);
  fragmentPath = resolvePath(fragmentPath);

  const refCounter = shaderCache.get(vertexPath)?.get(fragmentPath);

  // Return from cache
  if (refCounter) {
    refCounter.refs++;
    return refCounter.resource;
  }

  const [vertexSource, fragmentSource] = await Promise.all([
    fetch(vertexPath).then((response) => response.text()),
    fetch(fragmentPath).then((response) => response.text()),
  ]);

  let vertexShader;
  let fragmentShader;

  try {
    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  } catch (e) {
    gl.deleteShader(vertexShader ?? null);
    throw e;
  }

  const program = gl.createProgram();

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

  // Cache and return
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
    console.warn('Shader could not be destroyed. Not defined');
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteProgram(refCounter.resource.program);
    shaderCache.get(vertexPath)!.delete(fragmentPath);
  } else {
    refCounter.refs--;
  }
}
