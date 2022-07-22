import { MagFilter, MinFilter, WrapMode } from "../types";

export class Texture {
  public texCoord: number = 0;
  public minFilter: MinFilter = MinFilter.LINEAR_MIPMAP_LINEAR;
  public magFilter: MagFilter = MagFilter.LINEAR;
  public wrapS: WrapMode = WrapMode.REPEAT;
  public wrapT: WrapMode = WrapMode.REPEAT;

  constructor(public readonly image: ImageBitmap) {}
}