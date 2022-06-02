export function contextInit(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');

  if (gl === null) {    
    throw new Error('Unable to initialize WebGL 2.0');
  }

  return gl;
};
