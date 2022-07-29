/**
 * A basic math library for programming computer graphics.
 */

// Types
export type Vec2 = Readonly<[number, number]>;

export type Vec3 = Readonly<[number, number, number]>;

export type Vec4 = Readonly<[number, number, number, number]>;

export type Mat4 = Readonly<
  [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ]
>;

export type AABB = [Vec3, Vec3]; // TODO: This should be readonly

// Vector functions
export function vec2Add(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

export function vec3Add(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]];
}

export function vec4Add(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2], vec1[3] + vec2[3]];
}

export function vec2Subtract(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}

export function vec3Subtract(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]];
}

export function vec4Subtract(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2], vec1[3] - vec2[3]];
}

export function vec2Multiply(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1]];
}

export function vec3Multiply(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1], vec1[2] * vec2[2]];
}

export function vec4Multiply(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1], vec1[2] * vec2[2], vec1[3] * vec2[3]];
}

export function vec2Divide(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] / vec2[0], vec1[1] / vec2[1]];
}

export function vec3Divide(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] / vec2[0], vec1[1] / vec2[1], vec1[2] / vec2[2]];
}

export function vec4Divide(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] / vec2[0], vec1[1] / vec2[1], vec1[2] / vec2[2], vec1[3] / vec2[3]];
}

export function vec2Inverse(vec: Vec2): Vec2 {
  return [-vec[0], -vec[1]];
}

export function vec3Inverse(vec: Vec3): Vec3 {
  return [-vec[0], -vec[1], -vec[2]];
}

export function vec4Inverse(vec: Vec4): Vec4 {
  return [-vec[0], -vec[1], -vec[2], -vec[3]];
}

export function vec2MultiplyMat4(vec: Vec2, mat: Mat4): Vec2 {
  return [vec[0] * mat[0] + vec[1] * mat[4], vec[0] * mat[1] + vec[1] * mat[5]];
}

export function vec3MultiplyMat4(vec: Vec3, mat: Mat4): Vec3 {
  return [
    vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8],
    vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9],
    vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10],
  ];
}

export function vec4MultiplyMat4(vec: Vec4, mat: Mat4): Vec4 {
  return [
    vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8] + vec[3] * mat[12],
    vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9] + vec[3] * mat[13],
    vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10] + vec[3] * mat[14],
    vec[0] * mat[3] + vec[1] * mat[7] + vec[2] * mat[11] + vec[3] * mat[15],
  ];
}

export function vec2Normalize(vec: Vec2): Vec2 {
  const result: Vec2 = [0, 0];
  const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);

  if (!length) {
    return result;
  }

  const factor = 1 / length;

  return vec2Multiply(vec, [factor, factor]);
}

export function vec3Normalize(vec: Vec3): Vec3 {
  const result: Vec3 = [0, 0, 0];
  const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);

  if (!length) {
    return result;
  }

  const factor = 1 / length;

  return vec3Multiply(vec, [factor, factor, factor]);
}

export function vec4Normalize(vec: Vec4): Vec4 {
  const result: Vec4 = [0, 0, 0, 0];
  const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2] + vec[3] * vec[3]);

  if (!length) {
    return result;
  }

  const factor = 1 / length;

  return vec4Multiply(vec, [factor, factor, factor, factor]);
}

export function vec3CrossProduct(vec1: Vec3, vec2: Vec3): Vec3 {
  return [
    vec1[1] * vec2[2] - vec1[2] * vec2[1],
    vec1[2] * vec2[0] - vec1[0] * vec2[2],
    vec1[0] * vec2[1] - vec1[1] * vec2[0],
  ];
}

// Rotation functions
export function quatRotationX(angle: number): Vec4 {
  return quatRotationAxis([1, 0, 0], angle);
}

export function quatRotationY(angle: number): Vec4 {
  return quatRotationAxis([0, 1, 0], angle);
}

export function quatRotationZ(angle: number): Vec4 {
  return quatRotationAxis([0, 0, 1], angle);
}

export function quatRotationAxis(axis: Vec3, angle: number): Vec4 {
  const normalized = vec3Normalize(axis);
  const sin = Math.sin(angle / 2);
  const cos = Math.cos(angle / 2);

  return [normalized[0] * sin, normalized[1] * sin, normalized[2] * sin, cos];
}

// Reference: https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToQuaternion/index.htm
export function eulerToQuat(euler: Vec3): Vec4 {
  const cosX = Math.cos(euler[0] * 0.5);
  const cosY = Math.cos(euler[1] * 0.5);
  const cosZ = Math.cos(euler[2] * 0.5);

  const sinX = Math.sin(euler[0] * 0.5);
  const sinY = Math.sin(euler[1] * 0.5);
  const sinZ = Math.sin(euler[2] * 0.5);

  return [
    sinZ * sinY * cosX + cosZ * cosY * sinX,
    cosZ * sinY * cosX - sinZ * cosY * sinX,
    sinZ * cosY * cosX + cosZ * sinY * sinX,
    cosZ * cosY * cosX - sinZ * sinY * sinX,
  ];
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

// Matrix functions
export function mat4Empty(): Mat4 {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

export function mat4Identity(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function mat4Translation(translation: Vec3): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, translation[0], translation[1], translation[2], 1];
}

export function mat4Scale(scale: Vec3): Mat4 {
  return [scale[0], 0, 0, 0, 0, scale[1], 0, 0, 0, 0, scale[2], 0, 0, 0, 0, 1];
}

// Reference: https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToMatrix/index.htm
export function mat4RotationEuler(euler: Vec3): Mat4 {
  const cosX = Math.cos(euler[0]);
  const cosY = Math.cos(euler[1]);
  const cosZ = Math.cos(euler[2]);

  const sinX = Math.sin(euler[0]);
  const sinY = Math.sin(euler[1]);
  const sinZ = Math.sin(euler[2]);

  const xx = cosZ * cosY;
  const xy = -sinZ * cosY;
  const xz = sinY;

  const yx = cosZ * sinY * sinX + sinZ * cosX;
  const yy = -sinZ * sinY * sinX + cosZ * cosX;
  const yz = -cosY * sinX;

  const zx = sinZ * sinX - cosZ * sinY * cosX;
  const zy = sinZ * sinY * cosX + cosZ * sinX;
  const zz = cosY * cosX;

  return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, 0, 0, 0, 1];
}

// Reference: https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
export function mat4RotationQuat(quat: Vec4): Mat4 {
  const normalized = vec4Normalize(quat);

  const mulXX = normalized[0] * normalized[0];
  const mulXY = normalized[0] * normalized[1];
  const mulXZ = normalized[0] * normalized[2];
  const mulXW = normalized[0] * normalized[3];

  const mulYY = normalized[1] * normalized[1];
  const mulYZ = normalized[1] * normalized[2];
  const mulYW = normalized[1] * normalized[3];

  const mulZZ = normalized[2] * normalized[2];
  const mulZW = normalized[2] * normalized[3];

  const xx = 1 - 2 * (mulYY + mulZZ);
  const xy = 2 * (mulXY - mulZW);
  const xz = 2 * (mulXZ + mulYW);

  const yx = 2 * (mulXY + mulZW);
  const yy = 1 - 2 * (mulXX + mulZZ);
  const yz = 2 * (mulYZ - mulXW);

  const zx = 2 * (mulXZ - mulYW);
  const zy = 2 * (mulYZ + mulXW);
  const zz = 1 - 2 * (mulXX + mulYY);

  return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, 0, 0, 0, 1];
}

export function mat4Multiply(mat1: Mat4, mat2: Mat4): Mat4 {
  return [
    mat1[0] * mat2[0] + mat1[4] * mat2[1] + mat1[8] * mat2[2] + mat1[12] * mat2[3],
    mat1[1] * mat2[0] + mat1[5] * mat2[1] + mat1[9] * mat2[2] + mat1[13] * mat2[3],
    mat1[2] * mat2[0] + mat1[6] * mat2[1] + mat1[10] * mat2[2] + mat1[14] * mat2[3],
    mat1[3] * mat2[0] + mat1[7] * mat2[1] + mat1[11] * mat2[2] + mat1[15] * mat2[3],
    mat1[0] * mat2[4] + mat1[4] * mat2[5] + mat1[8] * mat2[6] + mat1[12] * mat2[7],
    mat1[1] * mat2[4] + mat1[5] * mat2[5] + mat1[9] * mat2[6] + mat1[13] * mat2[7],
    mat1[2] * mat2[4] + mat1[6] * mat2[5] + mat1[10] * mat2[6] + mat1[14] * mat2[7],
    mat1[3] * mat2[4] + mat1[7] * mat2[5] + mat1[11] * mat2[6] + mat1[15] * mat2[7],
    mat1[0] * mat2[8] + mat1[4] * mat2[9] + mat1[8] * mat2[10] + mat1[12] * mat2[11],
    mat1[1] * mat2[8] + mat1[5] * mat2[9] + mat1[9] * mat2[10] + mat1[13] * mat2[11],
    mat1[2] * mat2[8] + mat1[6] * mat2[9] + mat1[10] * mat2[10] + mat1[14] * mat2[11],
    mat1[3] * mat2[8] + mat1[7] * mat2[9] + mat1[11] * mat2[10] + mat1[15] * mat2[11],
    mat1[0] * mat2[12] + mat1[4] * mat2[13] + mat1[8] * mat2[14] + mat1[12] * mat2[15],
    mat1[1] * mat2[12] + mat1[5] * mat2[13] + mat1[9] * mat2[14] + mat1[13] * mat2[15],
    mat1[2] * mat2[12] + mat1[6] * mat2[13] + mat1[10] * mat2[14] + mat1[14] * mat2[15],
    mat1[3] * mat2[12] + mat1[7] * mat2[13] + mat1[11] * mat2[14] + mat1[15] * mat2[15],
  ];
}

export function mat4Transpose(mat: Mat4): Mat4 {
  return [
    mat[0],
    mat[4],
    mat[8],
    mat[12],
    mat[1],
    mat[5],
    mat[9],
    mat[13],
    mat[2],
    mat[6],
    mat[10],
    mat[14],
    mat[3],
    mat[7],
    mat[11],
    mat[15],
  ];
}

export function mat4Inverse(mat: Mat4): Mat4 {
  const s0 = mat[0] * mat[5] - mat[4] * mat[1];
  const s1 = mat[0] * mat[6] - mat[4] * mat[2];
  const s2 = mat[0] * mat[7] - mat[4] * mat[3];
  const s3 = mat[1] * mat[6] - mat[5] * mat[2];
  const s4 = mat[1] * mat[7] - mat[5] * mat[3];
  const s5 = mat[2] * mat[7] - mat[6] * mat[3];
  const s6 = mat[8] * mat[13] - mat[12] * mat[9];
  const s7 = mat[8] * mat[14] - mat[12] * mat[10];
  const s8 = mat[8] * mat[15] - mat[12] * mat[11];
  const s9 = mat[9] * mat[14] - mat[13] * mat[10];
  const s10 = mat[9] * mat[15] - mat[13] * mat[11];
  const s11 = mat[10] * mat[15] - mat[14] * mat[11];

  const determinant = s0 * s11 - s1 * s10 + s2 * s9 + s3 * s8 - s4 * s7 + s5 * s6;

  if (!determinant) {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  const factor = 1 / determinant;

  const xx = (mat[5] * s11 - mat[6] * s10 + mat[7] * s9) * factor;
  const xy = (mat[6] * s8 - mat[4] * s11 - mat[7] * s7) * factor;
  const xz = (mat[4] * s10 - mat[5] * s8 + mat[7] * s6) * factor;
  const xw = (mat[5] * s7 - mat[4] * s9 - mat[6] * s6) * factor;

  const yx = (mat[2] * s10 - mat[1] * s11 - mat[3] * s9) * factor;
  const yy = (mat[0] * s11 - mat[2] * s8 + mat[3] * s7) * factor;
  const yz = (mat[1] * s8 - mat[0] * s10 - mat[3] * s6) * factor;
  const yw = (mat[0] * s9 - mat[1] * s7 + mat[2] * s6) * factor;

  const zx = (mat[13] * s5 - mat[14] * s4 + mat[15] * s3) * factor;
  const zy = (mat[14] * s2 - mat[12] * s5 - mat[15] * s1) * factor;
  const zz = (mat[12] * s4 - mat[13] * s2 + mat[15] * s0) * factor;
  const zw = (mat[13] * s1 - mat[12] * s3 - mat[14] * s0) * factor;

  const wx = (mat[10] * s4 - mat[9] * s5 - mat[11] * s3) * factor;
  const wy = (mat[8] * s5 - mat[10] * s2 + mat[11] * s1) * factor;
  const wz = (mat[9] * s2 - mat[8] * s4 - mat[11] * s0) * factor;
  const ww = (mat[8] * s3 - mat[9] * s1 + mat[10] * s0) * factor;

  return [xx, yx, zx, wx, xy, yy, zy, wy, xz, yz, zz, wz, xw, yw, zw, ww];
}

export function mat4Perspective(
  fov: number,
  aspectRatio: number,
  nearClip: number,
  farClip: number
): Mat4 {
  const cotan = 1 / Math.tan(fov / 2);

  const xx = cotan / aspectRatio;
  const yy = cotan;
  const zz = (farClip + nearClip) / (nearClip - farClip);
  const zw = (2 * farClip * nearClip) / (nearClip - farClip);
  const wz = -1;

  return [xx, 0, 0, 0, 0, yy, 0, 0, 0, 0, zz, wz, 0, 0, zw, 0];
}

export function mat4Orthographic(
  left: number,
  right: number,
  top: number,
  bottom: number,
  nearClip: number,
  farClip: number
): Mat4 {
  const xx = 2 / (right - left);
  const yy = 2 / (top - bottom);
  const zz = -2 / (farClip - nearClip);

  const xw = -(right + left) / (right - left);
  const yw = -(top + bottom) / (top - bottom);
  const zw = -(farClip + nearClip) / (farClip - nearClip);

  return [xx, 0, 0, 0, 0, yy, 0, 0, 0, 0, zz, 0, xw, yw, zw, 1];
}

export function mat4LookAt(position: Vec3, target: Vec3, up: Vec3): Mat4 {
  const z = vec3Normalize(vec3Subtract(target, position));
  const x = vec3Normalize(vec3CrossProduct(z, up));
  const y = vec3CrossProduct(x, z);

  const xx = x[0];
  const xy = x[1];
  const xz = x[2];
  const xw = -(x[0] * position[0] + x[1] * position[1] + x[2] * position[2]);

  const yx = y[0];
  const yy = y[1];
  const yz = y[2];
  const yw = -(y[0] * position[0] + y[1] * position[1] + y[2] * position[2]);

  const zx = -z[0];
  const zy = -z[1];
  const zz = -z[2];
  const zw = z[0] * position[0] + z[1] * position[1] + z[2] * position[2];

  return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, xw, yw, zw, 1];
}

// AABB functions
export function aabbCalculate(vertices: Array<number>): AABB {
  let minX = 0;
  let minY = 0;
  let minZ = 0;

  let maxX = 0;
  let maxY = 0;
  let maxZ = 0;

  for (let i = 0; i < vertices.length; i += 3) {
    minX = Math.min(minX, vertices[i]);
    minY = Math.min(minY, vertices[i + 1]);
    minZ = Math.min(minZ, vertices[i + 2]);

    maxX = Math.max(maxX, vertices[i]);
    maxY = Math.max(maxY, vertices[i + 1]);
    maxZ = Math.max(maxZ, vertices[i + 2]);
  }

  return [
    [minX, minY, minZ],
    [maxX, maxY, maxZ],
  ];
}

export function aabbTransform(aabb: AABB, transform: Mat4): AABB {
  const center = vec3Multiply(vec3Add(aabb[0], aabb[1]), [0.5, 0.5, 0.5]);
  const extents = vec3Subtract(aabb[1], center);

  const nextCenter = vec4MultiplyMat4([...center, 1.0], transform);
  const nextExtents = vec3MultiplyMat4(extents, transform);

  const min = vec3Subtract([nextCenter[0], nextCenter[1], nextCenter[2]], nextExtents);
  const max = vec3Add([nextCenter[0], nextCenter[1], nextCenter[2]], nextExtents);

  return [min, max];
}
