import { Texture, TextureFormat, textureInit } from '../texture';
import { DdsParseException } from '../../expcetions';

const DDS_HEADER_SIZE = 0x80;
const DDS_MAGIC = 0x20534444;
const DDS_FORMAT_DXT1 = 0x31545844;
const DDS_FORMAT_DXT3 = 0x33545844;
const DDS_FORMAT_DXT5 = 0x35545844;

export function ddsParse(buffer: ArrayBuffer): Texture {
  const data = new Uint8Array(buffer);
  const headers = new Uint32Array(buffer.slice(0, DDS_HEADER_SIZE));

  if (headers[0] !== DDS_MAGIC) {
    throw new DdsParseException('Invalid magic value');
  }

  const width = headers[4];
  const height = headers[3];
  const mipmapCount = headers[7];
  const pixelFormat = headers[21];

  let format: TextureFormat | undefined;
  let bitsPerPixel: number | undefined;
  let swapBGR = false;

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

      swapBGR = rBits === 0xFF0000 && bBits === 0xFF;

      if ((swapBGR || rBits === 0xFF && bBits === 0xFF0000) && gBits === 0xFF00) {
        const aBits = headers[26];

        if (!aBits) {
          format = TextureFormat.RGB;
          bitsPerPixel = 24;
        } else if (aBits === 0xFF000000) {
          format = TextureFormat.RGBA;
          bitsPerPixel = 32;
        }
      }
      break;
  }

  if (format === undefined) {
    throw new DdsParseException('Unsupported format');
  }

  const bytesPerPixel = bitsPerPixel! / 8;

  if (swapBGR) {
    // Convert to RGB
    for (let i = DDS_HEADER_SIZE; i < data.length; i += bytesPerPixel) {
      const colorSwap = data[i];
      data[i] = data[i + 2];
      data[i + 2] = colorSwap;
    }
  }

  // DXT data cannot be smaller than 4x4 pixels
  const minSize = format === TextureFormat.DXT1 || format === TextureFormat.DXT3 || format === TextureFormat.DXT5 ? 4 : 1;
  const textureSize = Math.max(width, minSize) * Math.max(height, minSize) * bytesPerPixel;
  const textureData = data.slice(DDS_HEADER_SIZE, DDS_HEADER_SIZE + textureSize);
  const mipmaps = [];

  if (mipmapCount > 1) {
    let mipmapWidth = width / 2;
    let mipmapHeight = height / 2;
    let mipmapOffset = DDS_HEADER_SIZE + textureSize;

    for (let i = 0; i < mipmapCount - 1; i++) {
      const mipmapSize = Math.max(mipmapWidth, minSize) * Math.max(mipmapHeight, minSize) * bytesPerPixel;
      const mipmapData = data.slice(mipmapOffset, mipmapOffset + mipmapSize);

      mipmaps.push(mipmapData);

      mipmapWidth /= 2;
      mipmapHeight /= 2;
      mipmapOffset += mipmapSize;
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
