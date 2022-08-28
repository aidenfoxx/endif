export class Context {
  private static gl?: WebGL2RenderingContext;

  public static init(canvas: HTMLElement, options?: WebGLContextAttributes): void {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Invalid canvas element');
    }

    Context.gl = canvas.getContext('webgl2', options) ?? undefined;

    if (!Context.gl) {
      throw new Error('Failed to initialize WebGL context');
    }

    Context.gl.enable(Context.gl.DEPTH_TEST);
    Context.gl.enable(Context.gl.CULL_FACE);
  }

  public static getContent(): WebGL2RenderingContext {
    if (!Context.gl) {
      throw new Error('Context not initialized');
    }

    return Context.gl;
  }
}