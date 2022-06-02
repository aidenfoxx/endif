export function initContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');

  if (gl === null) {    
    throw new Error('Unable to initialize WebGL 2.0. This may not be supported by your browser.');
  }

  return gl;
};
