import { objParse } from './obj';
import { meshInit } from '../assets/mesh';

jest.mock('../assets/mesh', () => ({
  meshInit: jest.fn()
}))

describe('obj', () => {
  const meshInitMock = meshInit as jest.Mock;

  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('should parse obj', () => {
    const result = objParse(`
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

    expect(meshInitMock).toHaveBeenCalledWith(
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
    const result = objParse(`
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0
      v 0.0 0.5 0.0

      f 1 2 3
    `);

    expect(meshInitMock).toHaveBeenCalledWith(
      [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
      ],
      expect.any(Array),
      expect.any(Array),
      expect.any(Array)
    );
  });

  test('should parse uvs', () => {
    const result = objParse(`
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0
      v 0.0 0.5 0.0

      vt 0.5 1.0
      vt 1.0 0.25
      vt 0.0 0.25

      f 1/1 2/2 3/3
    `);

    expect(meshInitMock).toHaveBeenCalledWith(
      expect.any(Array),
      [
        0.5, 1,
        1, 0.25,
        0, 0.25
      ],
      expect.any(Array),
      expect.any(Array)
    );
  });

  test('should parse normals', () => {
    const result = objParse(`
      v -0.5 -0.5 0.0
      v 0.5 -0.5 0.0
      v 0.0 0.5 0.0

      vn 0.0 0.5 -0.5
      vn -0.5 -0.5 -0.5
      vn 0.5 -0.5 -0.5

      f 1//1 2//2 3//3
    `);

    expect(meshInitMock).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      [
        0, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
      ],
      expect.any(Array)
    );
  });

  test.todo('should index mesh');
});
