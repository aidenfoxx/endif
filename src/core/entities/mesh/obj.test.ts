import { objParse } from './obj';
import { meshInit } from '../mesh';
import { ObjParseException } from '../../expcetions';

jest.mock('../mesh', () => ({
  meshInit: jest.fn()
}))

describe('obj', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should parse obj', () => {
    objParse(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      vn 0.0 0.5 -0.5
      vn -0.5 -0.5 -0.5
      vn 0.5 -0.5 -0.5

      vt 0.5 1.0
      vt 1.0 0.25
      vt 0.0 0.25

      f 1/1/1 2/2/2 3/3/3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
      ],
      [
        0.5, 1,
        1, 0.25,
        0, 0.25
      ],
      [
        0, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
      ],
      [0, 1, 2]
    );
  });

  test('should parse obj with negative indices', () => {
    objParse(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      vn 0.0 0.5 -0.5
      vn -0.5 -0.5 -0.5
      vn 0.5 -0.5 -0.5

      vt 0.5 1.0
      vt 1.0 0.25
      vt 0.0 0.25

      f -3/-3/-3 -2/-2/-2 -1/-1/-1
    `);

    expect(meshInit).toHaveBeenCalledWith(
      [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
      ],
      [
        0.5, 1,
        1, 0.25,
        0, 0.25
      ],
      [
        0, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
      ],
      [0, 1, 2]
    );
  });

  test('should parse vertices', () => {
    objParse(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      f 1 2 3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
      ],
      expect.any(Object),
      expect.any(Object),
      expect.any(Object)
    );
  });

  test('should parse uvs', () => {
    objParse(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      vt 0.5 1.0
      vt 1.0 0.25
      vt 0.0 0.25

      f 1/1 2/2 3/3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      expect.any(Object),
      [
        0.5, 1,
        1, 0.25,
        0, 0.25
      ],
      expect.any(Object),
      expect.any(Object)
    );
  });

  test('should parse normals', () => {
    objParse(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      vn 0.0 0.5 -0.5
      vn -0.5 -0.5 -0.5
      vn 0.5 -0.5 -0.5

      f 1//1 2//2 3//3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      [
        0, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
      ],
      expect.any(Object)
    );
  });

  test('should index mesh', () => {
    objParse(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0
      v 1.0 0.5 0.0
      
      f 1 2 3
      f 1 3 4
    `);

    expect(meshInit).toHaveBeenCalledWith(
      [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        1.0, 0.5, 0.0
      ],
      expect.any(Object),
      expect.any(Object),
      [0, 1, 2, 0, 2, 3]
    );
  });

  test('should throw when no faces defined', () => {
    const action = () => {
      objParse('')
    };

    expect(action).toThrow(new ObjParseException('No faces defined'));
  });

  test('should throw when vertex out-of-bounds', () => {
    const action = () => {
      objParse(`
        f 1 2 3
      `)
    };

    expect(action).toThrow(new ObjParseException('Vertex index out-of-bounds'));
  });

  test('should throw when uv out-of-bounds', () => {
    const action = () => {
      objParse(`
        v 0.0 0.5 0.0
        v -0.5 -0.5 0.0
        v 0.5 -0.5 0.0

        f 1/1 2/2 3/3
      `)
    };

    expect(action).toThrow(new ObjParseException('UV index out-of-bounds'));
  });

  test('should throw when normal out-of-bounds', () => {
    const action = () => {
      objParse(`
        v 0.0 0.5 0.0
        v -0.5 -0.5 0.0
        v 0.5 -0.5 0.0

        f 1//1 2//2 3//3
      `)
    };

    expect(action).toThrow(new ObjParseException('Normal index out-of-bounds'));
  });
});
