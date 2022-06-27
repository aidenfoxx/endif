import { materialInit } from '../../entities/material';
import { ParseException } from '../../expcetions';
import { mtlParse } from './mtl';

jest.mock('../../entities/material', () => ({
  materialInit: jest.fn(),
}));

describe('mtl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should parse mtl', () => {
    mtlParse(`
      Kd 1.0 2.0 3.0
      Ks 4.0 5.0 6.0
      Pr 7.0 8.0 9.0
      Pm 10.0 11.0 12.0

      map_Kd diffuse.tga
      map_Ks specular.tga
      map_Pr roughness.tga
      map_Pm metallic.tga
      norm -s 1 1 1 normal.tga
    `);

    expect(materialInit).toHaveBeenCalledWith(
      [1, 2, 3],
      {
        specular: [4, 5, 6],
        roughness: [7, 8, 9],
        metallic: [10, 11, 12],
      },
      {
        diffuseMap: 'diffuse.tga',
        specularMap: 'specular.tga',
        roughnessMap: 'roughness.tga',
        metallicMap: 'metallic.tga',
        normalMap: 'normal.tga',
      }
    );
  });

  test('should throw when no diffuse defined', () => {
    const action = () => {
      mtlParse('');
    };

    expect(action).toThrow(new ParseException('No diffuse value defined'));
  });
});
