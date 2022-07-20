import { Texture } from "./Texture";

export enum TextureWrapS {
  CLAMP_TO_EDGE = WebGL2RenderingContext.CLAMP_TO_EDGE,
  MIRRORED_REPEAT = WebGL2RenderingContext.MIRRORED_REPEAT,
  REPEAT = WebGL2RenderingContext.REPEAT,
}

export enum TextureWrapT {
  CLAMP_TO_EDGE = WebGL2RenderingContext.CLAMP_TO_EDGE,
  MIRRORED_REPEAT = WebGL2RenderingContext.MIRRORED_REPEAT,
  REPEAT = WebGL2RenderingContext.REPEAT,
}

export class TextureSampler {
  public readonly texture: Texture;

  public readonly wrapS: TextureWrapS;

  public readonly wrapT: TextureWrapT;

  constructor(
    texture: Texture,
    wrapS: TextureWrapS = TextureWrapS.REPEAT,
    wrapT: TextureWrapT = TextureWrapT.REPEAT
  ) {
    this.texture = texture;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
  }
}