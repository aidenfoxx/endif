import { MagFilter, MinFilter, WrapMode } from "../../types";

export class TextureBuffer {
  constructor(
    public readonly buffer: ImageBitmap,
    public readonly texCoord: number = 0,
    public readonly magFilter: MagFilter = MagFilter.LINEAR,
    public readonly minFilter: MinFilter = MinFilter.LINEAR_MIPMAP_LINEAR,
    public readonly wrapS: WrapMode = WrapMode.REPEAT,
    public readonly wrapT: WrapMode = WrapMode.REPEAT
  ) {}
}