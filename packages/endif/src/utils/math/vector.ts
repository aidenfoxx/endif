import { Mat4 } from './matrix';

export type Vec2 = [number, number];

export type Vec3 = [number, number, number];

export type Vec4 = [number, number, number, number];

// Vec4
export function vec2Add(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

export function vec2Subtract(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}

export function vec2Multiply(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1]];
}

export function vec2Divide(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] / vec2[0], vec1[1] / vec2[1]];
}

export function vec2Inverse(vec: Vec2): Vec2 {
  return [-vec[0], -vec[1]];
}

export function vec2MultiplyMat4(vec: Vec2, mat: Mat4): Vec2 {
  return [vec[0] * mat[0] + vec[1] * mat[4], vec[0] * mat[1] + vec[1] * mat[5]];
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

// Vec3
export function vec3Add(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]];
}

export function vec3Subtract(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]];
}

export function vec3Multiply(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1], vec1[2] * vec2[2]];
}

export function vec3Divide(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] / vec2[0], vec1[1] / vec2[1], vec1[2] / vec2[2]];
}

export function vec3Inverse(vec: Vec3): Vec3 {
  return [-vec[0], -vec[1], -vec[2]];
}

export function vec3MultiplyMat4(vec: Vec3, mat: Mat4): Vec3 {
  return [
    vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8],
    vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9],
    vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10],
  ];
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

export function vec3CrossProduct(vec1: Vec3, vec2: Vec3): Vec3 {
  return [
    vec1[1] * vec2[2] - vec1[2] * vec2[1],
    vec1[2] * vec2[0] - vec1[0] * vec2[2],
    vec1[0] * vec2[1] - vec1[1] * vec2[0],
  ];
}

// Vec4
export function vec4Add(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2], vec1[3] + vec2[3]];
}

export function vec4Subtract(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2], vec1[3] - vec2[3]];
}

export function vec4Multiply(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1], vec1[2] * vec2[2], vec1[3] * vec2[3]];
}

export function vec4Divide(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] / vec2[0], vec1[1] / vec2[1], vec1[2] / vec2[2], vec1[3] / vec2[3]];
}

export function vec4Inverse(vec: Vec4): Vec4 {
  return [-vec[0], -vec[1], -vec[2], -vec[3]];
}

export function vec4MultiplyMat4(vec: Vec4, mat: Mat4): Vec4 {
  return [
    vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8] + vec[3] * mat[12],
    vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9] + vec[3] * mat[13],
    vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10] + vec[3] * mat[14],
    vec[0] * mat[3] + vec[1] * mat[7] + vec[2] * mat[11] + vec[3] * mat[15],
  ];
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
