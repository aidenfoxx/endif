export function contextInit(viewport: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = viewport.getContext('webgl2', { antialias: false });

  if (gl === null) {
    throw new Error('Unable to initialize WebGL 2.0');
  }

  return gl;
}
