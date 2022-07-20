export enum WrapMode {
  CLAMP_TO_EDGE = WebGL2RenderingContext.CLAMP_TO_EDGE,
  MIRRORED_REPEAT = WebGL2RenderingContext.MIRRORED_REPEAT,
  REPEAT = WebGL2RenderingContext.REPEAT
}

export class Texture {
  public texCoord: number = 0;
  public wrapS: WrapMode = WrapMode.REPEAT;
  public wrapT: WrapMode = WrapMode.REPEAT;

  constructor(public readonly image: ImageBitmap) {}
}