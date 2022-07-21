import { WrapMode } from "../types";

export class Texture {
  public texCoord: number = 0;
  public wrapS: WrapMode = WrapMode.REPEAT;
  public wrapT: WrapMode = WrapMode.REPEAT;

  constructor(public readonly image: ImageBitmap) {}
}