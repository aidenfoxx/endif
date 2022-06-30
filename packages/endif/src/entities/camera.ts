import {
  Mat4,
  mat4Multiply,
  mat4RotationEuler,
  mat4Scale,
  mat4Translation,
  Vec3,
  vec3Add,
  vec3Multiply
} from '../utils/math';

export interface Camera {
  position: Vec3;
  rotation: Vec3;
  projection: Mat4;
  view: Mat4;
}

function calculateViewMatrix(position: Vec3, rotation: Vec3): Mat4 {
  return mat4Multiply(mat4RotationEuler(rotation), mat4Translation(position));
}

export function cameraInit(position: Vec3, rotation: Vec3, projection: Mat4): Camera {
  return {
    position,
    rotation: rotation,
    projection: projection,
    view: calculateViewMatrix(position, rotation),
  };
}

export function cameraTranslate(camera: Camera, translation: Vec3): void {
  const rotationMatrix = mat4RotationEuler(camera.rotation);

  const axisX: Vec3 = [rotationMatrix[0], rotationMatrix[4], rotationMatrix[8]];
  const axisY: Vec3 = [rotationMatrix[1], rotationMatrix[5], rotationMatrix[9]];
  // Flip Z axis to be forward
  const axisZ: Vec3 = [-rotationMatrix[2], -rotationMatrix[6], -rotationMatrix[10]];

  const translateX: Vec3 = [translation[0], translation[0], translation[0]];
  const translateY: Vec3 = [translation[1], translation[1], translation[1]];
  const translateZ: Vec3 = [translation[2], translation[2], translation[2]];

  let nextPosition = vec3Add(camera.position, vec3Multiply(axisX, translateX));
  nextPosition = vec3Add(nextPosition, vec3Multiply(axisY, translateY));
  nextPosition = vec3Add(nextPosition, vec3Multiply(axisZ, translateZ));

  camera.position = nextPosition;
  camera.view = mat4Multiply(rotationMatrix, mat4Translation(nextPosition));
}

export function cameraSetPosition(camera: Camera, position: Vec3): void {
  camera.position = position;
  camera.view = calculateViewMatrix(position, camera.rotation);
}

export function cameraRotate(camera: Camera, rotation: Vec3): void {
  const nextRotation = vec3Add(camera.rotation, rotation);

  camera.rotation = nextRotation;
  camera.view = calculateViewMatrix(camera.position, nextRotation);
}

export function cameraSetRotation(camera: Camera, rotation: Vec3): void {
  camera.rotation = rotation;
  camera.view = calculateViewMatrix(camera.position, rotation);
}

const test = cameraInit([0, 0, 0], [0, 0, 0], mat4Scale([1, 1, 1]));

cameraSetPosition(test, [1, 2, 3]);
