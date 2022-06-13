export enum TextureFormat {
  RGB,
  RGBA,
  RGBA_5_5_5_1,
  DXT1,
  DXT3,
  DXT5
}

export interface Texture {
  format: TextureFormat;
  data: Uint8Array;
  width: number;
  height: number;
  bitsPerPixel: number;
  mipmaps: number;
}

export function textureInit(
  data: Uint8Array,
  width: number,
  height: number,
  format: TextureFormat = TextureFormat.RGB,
  bitsPerPixel: number = 24,
  mipmaps: number = 0
) {
  return {
    format,
    data,
    width,
    height,
    bitsPerPixel,
    mipmaps
  };
}
