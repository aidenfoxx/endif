import * as math from './math';

describe('math', () => {
  describe('Vec2', () => {
    test('should add', () => {
      const result = math.vec2Add([1, 2], [3, 4]);

      expect(result).toEqual([4, 6]);
    });

    test('should subtract', () => {
      const result = math.vec2Subtract([1, 2], [-3, -4]);

      expect(result).toEqual([4, 6]);
    });

    test('should multiply', () => {
      const result = math.vec2Multiply([1, 2], [3, 4]);

      expect(result).toEqual([3, 8]);
    });

    test('should divide', () => {
      const result = math.vec2Divide([1, 2], [3, 4]);

      expect(result).toEqual([0.3333333333333333, 0.5]);
    });

    test('should invert', () => {
      const result = math.vec2Inverse([1, 2]);

      expect(result).toEqual([-1, -2]);
    });

    // TODO: Add test for mat4 multiply

    test('should normalize', () => {
      const result = math.vec2Normalize([1, 2]);

      expect(result).toEqual([0.4472135954999579, 0.8944271909999159]);
    });
  });

  describe('Vec3', () => {
    test('should add', () => {
      const result = math.vec3Add([1, 2, 3], [4, 5, 6]);

      expect(result).toEqual([5, 7, 9]);
    });

    test('should subtract', () => {
      const result = math.vec3Subtract([1, 2, 3], [-4, -5, -6]);

      expect(result).toEqual([5, 7, 9]);
    });

    test('should multiply', () => {
      const result = math.vec3Multiply([1, 2, 3], [4, 5, 6]);

      expect(result).toEqual([4, 10, 18]);
    });

    test('should divide', () => {
      const result = math.vec3Divide([1, 2, 3], [4, 5, 6]);

      expect(result).toEqual([0.25, 0.4, 0.5]);
    });

    test('should invert', () => {
      const result = math.vec3Inverse([1, 2, 3]);

      expect(result).toEqual([-1, -2, -3]);
    });

    // TODO: Add test for mat4 multiply

    test('should normalize', () => {
      const result = math.vec3Normalize([1, 2, 3]);

      expect(result).toEqual([0.2672612419124244, 0.5345224838248488, 0.8017837257372732]);
    });

    test('should calculate cross product', () => {
      const result = math.vec3CrossProduct([1, 2, 3], [4, 5, 6]);

      expect(result).toEqual([-3, 6, -3]);
    });
  });

  describe('Vec4', () => {
    test('should add', () => {
      const result = math.vec4Add([1, 2, 3, 4], [5, 6, 7, 8]);

      expect(result).toEqual([6, 8, 10, 12]);
    });

    test('should subtract', () => {
      const result = math.vec4Subtract([1, 2, 3, 4], [-5, -6, -7, -8]);

      expect(result).toEqual([6, 8, 10, 12]);
    });

    test('should multiply', () => {
      const result = math.vec4Multiply([1, 2, 3, 4], [5, 6, 7, 8]);

      expect(result).toEqual([5, 12, 21, 32]);
    });

    test('should divide', () => {
      const result = math.vec4Divide([1, 2, 3, 4], [5, 6, 7, 8]);

      expect(result).toEqual([0.2, 0.3333333333333333, 0.42857142857142855, 0.5]);
    });

    test('should invert', () => {
      const result = math.vec4Inverse([1, 2, 3, 4]);

      expect(result).toEqual([-1, -2, -3, -4]);
    });

    // TODO: Add test for mat4 multiply

    test('should normalize', () => {
      const result = math.vec4Normalize([1, 2, 3, 4]);

      expect(result).toEqual([
        0.18257418583505536, 0.3651483716701107, 0.5477225575051661, 0.7302967433402214,
      ]);
    });
  });

  describe('Quat', () => {
    test('should calculate X rotation', () => {
      const result = math.quatRotationX(1);

      expect(result).toEqual([0.479425538604203, 0, 0, 0.8775825618903728]);
    });

    test('should calculate Y rotation', () => {
      const result = math.quatRotationY(1);

      expect(result).toEqual([0, 0.479425538604203, 0, 0.8775825618903728]);
    });

    test('should calculate X rotation', () => {
      const result = math.quatRotationZ(1);

      expect(result).toEqual([0, 0, 0.479425538604203, 0.8775825618903728]);
    });

    test('should calculate axis rotation', () => {
      const result = math.quatRotationAxis([1, 1, 1], 1);

      expect(result).toEqual([
        0.27679646376951794, 0.27679646376951794, 0.27679646376951794, 0.8775825618903728,
      ]);
    });

    test('should convert euler to quat', () => {
      const result = math.eulerToQuat([1, 1, 1]);

      expect(result).toEqual([
        0.5709414713577319, 0.16751879124639693, 0.5709414713577319, 0.5656758145325667,
      ]);
    });

    test('should convert degrees to radians', () => {
      expect(math.degreesToRadians(90)).toBe(1.5707963267948966);
    });

    test('should convert radiants to degrees', () => {
      expect(math.radiansToDegrees(1.5707963267948966)).toBe(90);
    });
  });

  describe('Mat4', () => {
    test('should create translation matrix', () => {
      const result = math.mat4Translation([1, 2, 3]);

      expect(result).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1]);
    });

    test('should create scale matrix', () => {
      const result = math.mat4Scale([1, 2, 3]);

      expect(result).toEqual([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1]);
    });

    test('should create euler rotation matrix', () => {
      const result = math.mat4RotationEuler([1, 2, 3]);

      expect(result).toEqual([
        0.411982245665683, -0.6812427202564033, 0.6051272472413687, 0, 0.05872664492762098,
        -0.642872836134547, -0.7637183366502791, 0, 0.9092974268256817, 0.35017548837401463,
        -0.2248450953661529, 0, 0, 0, 0, 1,
      ]);
    });

    test('should create quat rotation matrix', () => {
      const result = math.mat4RotationQuat([1, 2, 3, 4]);

      expect(result).toEqual([
        0.13333333333333353, 0.9333333333333332, -0.33333333333333326, 0, -0.6666666666666666,
        0.3333333333333335, 0.6666666666666665, 0, 0.7333333333333332, 0.13333333333333336,
        0.6666666666666667, 0, 0, 0, 0, 1,
      ]);
    });

    test('should multiply', () => {
      const result = math.mat4Multiply(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
      );

      expect(result).toEqual([
        386, 444, 502, 560, 274, 316, 358, 400, 162, 188, 214, 240, 50, 60, 70, 80,
      ]);
    });

    test('should transpose', () => {
      const result = math.mat4Transpose([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

      expect(result).toEqual([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);
    });

    test('should invert', () => {
      const result = math.mat4Invert([1, 2, 3, 4, 0, 2, 0, 0, 0, 2, 3, 0, 0, 2, 0, 4]);

      expect(result).toEqual([
        1, 1, -1, -1, 0, 0.5, 0, 0, 0, -0.3333333333333333, 0.3333333333333333, 0, 0, -0.25, 0,
        0.25,
      ]);
    });

    test('should calculate perspective', () => {
      const result = math.mat4Perspective(1.5, 1, 0.1, 1000);

      expect(result).toEqual([
        1.0734261485493772, 0, 0, 0, 0, 1.0734261485493772, 0, 0, 0, 0, -1.0002000200020003, -1, 0,
        0, -0.20002000200020004, 0,
      ]);
    });

    test('should calculate look at', () => {
      const result = math.mat4LookAt([1, 2, 3], [4, 5, 6], [0, 1, 0]);

      expect(result).toEqual([
        -0.7071067811865475, -0.40824829046386296, -0.5773502691896257, 0, 0, 0.8164965809277259,
        -0.5773502691896257, 0, 0.7071067811865475, -0.40824829046386296, -0.5773502691896257, 0,
        -1.414213562373095, -0, 3.4641016151377544, 1,
      ]);
    });
  });
});
