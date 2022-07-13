import { Texture, TextureFormat, textureInit } from '../entities/texture';
import { ParseException } from '../exceptions';

const DDS_HEADER_SIZE = 0x80;
const DDS_MAGIC = 0x20534444;
const DDS_FORMAT_DXT1 = 0x31545844;
const DDS_FORMAT_DXT3 = 0x33545844;
const DDS_FORMAT_DXT5 = 0x35545844;
const DDS_CUBEMAP_ALLFACES = 0xfe00;

export function parseDDS(gl: WebGL2RenderingContext, buffer: ArrayBuffer): Texture {
  const data = new Uint8Array(buffer);
  const headers = new Uint32Array(buffer.slice(0, DDS_HEADER_SIZE));

  if (headers[0] !== DDS_MAGIC) {
    throw new ParseException('Invalid magic value');
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

      swapBGR = rBits === 0xff0000 && bBits === 0xff;

      if ((swapBGR || (rBits === 0xff && bBits === 0xff0000)) && gBits === 0xff00) {
        const aBits = headers[26];

        if (!aBits) {
          format = TextureFormat.RGB;
          bitsPerPixel = 24;
        } else if (aBits === 0xff000000) {
          format = TextureFormat.RGBA;
          bitsPerPixel = 32;
        }
      }
      break;
  }

  if (format === undefined) {
    throw new ParseException('Unsupported format');
  }

  const bytesPerPixel = bitsPerPixel! / 8;
  // DXT data cannot be smaller than 4x4 pixels
  const minSize =
    format === TextureFormat.DXT1 || format === TextureFormat.DXT3 || format === TextureFormat.DXT5
      ? 4
      : 1;
  const mipmaps = [];

  let mipmapWidth = width;
  let mipmapHeight = height;
  let mipmapOffset = DDS_HEADER_SIZE;
  let i = 0;

  // TODO: Add cubemap handling

  do {
    const mipmapSize =
      Math.max(mipmapWidth, minSize) * Math.max(mipmapHeight, minSize) * bytesPerPixel;
    const mipmapData = data.slice(mipmapOffset, mipmapOffset + mipmapSize);

    if (swapBGR) {
      // Convert to RGB
      for (let i = 0; i < mipmapSize; i += bytesPerPixel) {
        const colorSwap = mipmapData[i];
        mipmapData[i] = mipmapData[i + 2];
        mipmapData[i + 2] = colorSwap;
      }
    }

    // TODO: We need to flip the texture for GL

    mipmaps.push(mipmapData);

    mipmapWidth /= 2;
    mipmapHeight /= 2;
    mipmapOffset += mipmapSize;
  } while (++i < mipmapCount);

  return textureInit(gl, mipmaps.shift()!, width, height, format, bitsPerPixel, mipmaps);
}
