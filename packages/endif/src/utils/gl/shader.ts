function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
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

export function shaderCreate(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  let vertexShader;
  let fragmentShader;

  try {
    vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
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

  return program;
}
