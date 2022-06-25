import { TextureFormat, textureInit } from '../../entities/texture';
import { tgaParse } from './tga';

jest.mock('../../entities/texture', () => ({
  ...jest.requireActual('../../entities/texture'),
  textureInit: jest.fn(),
}));

describe('tga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should parse 24bpp tga', () => {
    tgaParse(
      new Uint8Array([
        0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x04,
        0x00, 0x18, 0x00, 0xbf, 0xbf, 0xbf, 0x7f, 0x7f, 0x7f, 0x3f, 0x3f, 0x3f, 0x00, 0x00, 0x00,
        0xff, 0x00, 0x00, 0xbf, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x3f, 0x00, 0x00,
      ]).buffer
    );

    expect(textureInit).toHaveBeenCalledWith(
      expect.objectContaining([
        0xbf, 0xbf, 0xbf, 0x7f, 0x7f, 0x7f, 0x3f, 0x3f, 0x3f, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff,
        0x00, 0x00, 0xbf, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x3f,
      ]),
      4,
      4,
      TextureFormat.RGB,
      24
    );
  });

  test('should parse 32bpp tga', () => {
    tgaParse(
      new Uint8Array([
        0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x04,
        0x00, 0x20, 0x08, 0x00, 0x00, 0x00, 0x3f, 0x00, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0xbf,
        0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0xff, 0xbf, 0x00, 0x00, 0xff, 0x7f, 0x00, 0x00,
        0xff, 0x3f, 0x00, 0x00, 0xff,
      ]).buffer
    );

    expect(textureInit).toHaveBeenCalledWith(
      expect.objectContaining([
        0x00, 0x00, 0x00, 0x3f, 0x00, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0xbf, 0x00, 0x00, 0x00,
        0xff, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0xbf, 0xff, 0x00, 0x00, 0x7f, 0xff, 0x00, 0x00,
        0x3f, 0xff,
      ]),
      4,
      4,
      TextureFormat.RGBA,
      32
    );
  });
});
