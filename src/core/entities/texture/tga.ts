import { Texture, TextureFormat, textureInit } from '../texture';
import { TgaParseException } from '../../expcetions/TgaParseException';

const TGA_HEADER_SIZE = 0x12;
const TGA_RGB_FORMAT = 2;

export function tgaParse(buffer: ArrayBuffer): Texture {
  const data = new Uint8Array(buffer);

  const idLength = data[0];
  const dataType = data[2];

  if (dataType !== TGA_RGB_FORMAT) {
    throw new TgaParseException('Unsupported data type');
  }

  const width = (data[13] << 8) + data[12];
  const height = (data[15] << 8) + data[14];
  const bitsPerPixel = data[16];

  let format: TextureFormat | undefined;

  switch (bitsPerPixel) {
    case 24:
      format = TextureFormat.RGB;
      break;

    case 32:
      format = TextureFormat.RGBA;
      break;
  }

  if (format === undefined) {
    throw new TgaParseException('Unsupported format');
  }

  const bytesPerPixel = bitsPerPixel / 8;
  const textureSize = width * height * bytesPerPixel;
  const textureData = data.slice(TGA_HEADER_SIZE + idLength, TGA_HEADER_SIZE + textureSize);

  // Convert to RGB
  for (let i = 0; i < textureSize; i += bytesPerPixel) {
    const colorSwap = textureData[i];
    textureData[i] = textureData[i + 2];
    textureData[i + 2] = colorSwap;
  }

  return textureInit(
    textureData,
    width,
    height,
    format,
    bitsPerPixel
  );
}
