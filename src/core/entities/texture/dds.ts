import { Texture, TextureFormat, textureInit } from '../texture';
import { DdsParseException } from '../../expcetions';

const DDS_HEADER_SIZE = 0x80;
const DDS_MAGIC = 0x20534444;
const DDS_FORMAT_DXT1 = 0x31545844;
const DDS_FORMAT_DXT3 = 0x33545844;
const DDS_FORMAT_DXT5 = 0x35545844;

export function parseDds(buffer: ArrayBuffer): Texture {
  const data = new Uint8Array(buffer);
  const headers = new Uint32Array(buffer.slice(0, DDS_HEADER_SIZE));

  if (headers[0] !== DDS_MAGIC) {
    throw new DdsParseException('Invalid magic value');
  }

  const width = headers[4];
  const height = headers[3];
  const mipmaps = headers[7];
  const pixelFormat = headers[21];

  let format: TextureFormat | undefined;
  let bitsPerPixel: number | undefined;

  switch (pixelFormat) {
    case DDS_FORMAT_DXT1:
      format = TextureFormat.DXT1;
      bitsPerPixel = 4;
      break;

    case DDS_FORMAT_DXT3:
      format = TextureFormat.DXT3;
      bitsPerPixel = 8;
      break;

    case DDS_FORMAT_DXT5:
      format = TextureFormat.DXT5;
      bitsPerPixel = 8;
      break;

    default:
      const rBits = headers[23];
      const gBits = headers[24];
      const bBits = headers[25];

      if (rBits === 0xFF0000 && gBits === 0xFF00 && bBits === 0xFF) {
        const aBits = headers[26];

        if (aBits === 0xFF000000) {
          format = TextureFormat.RGBA;
          bitsPerPixel = 32;
        } else if (!aBits) {
          format = TextureFormat.RGB;
          bitsPerPixel = 24;
        }
      }
      break;
  }

  if (format === undefined) {
    throw new DdsParseException('Unsupported format');
  }

  const bytesPerPixel = bitsPerPixel! / 8;

  let textureSize = 0;
  let mipmapWidth = width;
  let mipmapHeight = height;

  for (let i = 0; i < mipmaps; i++) {
    textureSize += mipmapWidth * mipmapHeight * bytesPerPixel;
    mipmapWidth /= 2;
    mipmapHeight /= 2;
  }

  const textureData = data.slice(DDS_HEADER_SIZE, DDS_HEADER_SIZE + textureSize)

  if (format === TextureFormat.RGB || format === TextureFormat.RGBA) {
    // Convert to RGB
    for (let i = 0; i < textureSize; i += bitsPerPixel!) {
      const colorSwap = textureData[i];
      textureData[i] = textureData[i + 2];
      textureData[i + 2] = colorSwap;
    }
  }

  return textureInit(
    textureData,
    width,
    height,
    format,
    bitsPerPixel,
    mipmaps
  );
}
