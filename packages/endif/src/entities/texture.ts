export enum TextureFormat {
  RGB,
  RGBA,
  DXT1,
  DXT3,
  DXT5,
}

export interface Texture {
  format: TextureFormat;
  data: Uint8Array;
  width: number;
  height: number;
  bitsPerPixel: number;
  mipmaps: Array<Uint8Array>;
}

export function textureInit(
  data: Uint8Array,
  width: number,
  height: number,
  format: TextureFormat = TextureFormat.RGB,
  bitsPerPixel: number = 24,
  mipmaps: Array<Uint8Array> = []
): Texture {
  return {
    data: new Uint8Array(data),
    width,
    height,
    format,
    bitsPerPixel,
    mipmaps: mipmaps.map((mipmap) => new Uint8Array(mipmap)),
  };
}
