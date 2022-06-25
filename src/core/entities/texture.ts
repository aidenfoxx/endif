export enum TextureFormat {
  RGB,
  RGBA,
  DXT1,
  DXT3,
  DXT5,
}

export interface Texture {
  readonly format: TextureFormat;
  readonly data: ReadonlyUint8Array;
  readonly width: number;
  readonly height: number;
  readonly bitsPerPixel: number;
  readonly mipmaps: ReadonlyArray<ReadonlyUint8Array>;
}

export function textureInit(
  data: ReadonlyUint8Array,
  width: number,
  height: number,
  format: TextureFormat = TextureFormat.RGB,
  bitsPerPixel: number = 24,
  mipmaps: ReadonlyArray<ReadonlyUint8Array> = []
) {
  return {
    data: new Uint8Array(data),
    width,
    height,
    format,
    bitsPerPixel,
    mipmaps: mipmaps.map((mipmap) => new Uint8Array(mipmap)),
  };
}
