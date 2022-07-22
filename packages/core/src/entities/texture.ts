import { MagFilter, MinFilter, WrapMode } from "../types";

export class Texture {
  constructor(
    public readonly image: ImageBitmap,
    public readonly texCoord: number = 0,
    public readonly minFilter: MinFilter = MinFilter.LINEAR_MIPMAP_LINEAR,
    public readonly magFilter: MagFilter = MagFilter.LINEAR,
    public readonly wrapS: WrapMode = WrapMode.REPEAT,
    public readonly wrapT: WrapMode = WrapMode.REPEAT
  ) {}
}