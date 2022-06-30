import { meshInit } from '../../entities/mesh';
import { ParseException } from '../../expcetions';
import { parseOBJ } from './parseOBJ';

jest.mock('../../entities/mesh', () => ({
  meshInit: jest.fn(),
}));

describe('obj', () => { // TODO: Update desc
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should parse obj', () => {
    parseOBJ(`
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
      [0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0],
      [0.5, 1, 1, 0.25, 0, 0.25],
      [0, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5],
      [0, 1, 2]
    );
  });

  test('should parse obj with negative indices', () => {
    parseOBJ(`
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
      [0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0],
      [0.5, 1, 1, 0.25, 0, 0.25],
      [0, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5],
      [0, 1, 2]
    );
  });

  test('should parse vertices', () => {
    parseOBJ(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      f 1 2 3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      [0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0],
      expect.any(Array),
      expect.any(Array),
      expect.any(Array)
    );
  });

  test('should parse uvs', () => {
    parseOBJ(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      vt 0.5 1.0
      vt 1.0 0.25
      vt 0.0 0.25

      f 1/1 2/2 3/3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      expect.any(Array),
      [0.5, 1, 1, 0.25, 0, 0.25],
      expect.any(Array),
      expect.any(Array)
    );
  });

  test('should parse normals', () => {
    parseOBJ(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0

      vn 0.0 0.5 -0.5
      vn -0.5 -0.5 -0.5
      vn 0.5 -0.5 -0.5

      f 1//1 2//2 3//3
    `);

    expect(meshInit).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      [0, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5],
      expect.any(Array)
    );
  });

  test('should index mesh', () => {
    parseOBJ(`
      v 0.0 0.5 0.0
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0
      v 1.0 0.5 0.0
      
      f 1 2 3
      f 1 3 4
    `);

    expect(meshInit).toHaveBeenCalledWith(
      [0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0, 1.0, 0.5, 0.0],
      expect.any(Array),
      expect.any(Array),
      [0, 1, 2, 0, 2, 3]
    );
  });

  test('should throw when no faces defined', () => {
    const action = () => {
      parseOBJ('');
    };

    expect(action).toThrow(new ParseException('No faces defined'));
  });

  test('should throw when vertex out-of-bounds', () => {
    const action = () => {
      parseOBJ(`
        f 1 2 3
      `);
    };

    expect(action).toThrow(new ParseException('Vertex index out-of-bounds'));
  });

  test('should throw when uv out-of-bounds', () => {
    const action = () => {
      parseOBJ(`
        v 0.0 0.5 0.0
        v -0.5 -0.5 0.0
        v 0.5 -0.5 0.0

        f 1/1 2/2 3/3
      `);
    };

    expect(action).toThrow(new ParseException('UV index out-of-bounds'));
  });

  test('should throw when normal out-of-bounds', () => {
    const action = () => {
      parseOBJ(`
        v 0.0 0.5 0.0
        v -0.5 -0.5 0.0
        v 0.5 -0.5 0.0

        f 1//1 2//2 3//3
      `);
    };

    expect(action).toThrow(new ParseException('Normal index out-of-bounds'));
  });
});
