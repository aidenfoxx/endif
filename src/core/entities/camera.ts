import {
  Vec3,
  Mat4,
  mat4Multiply,
  mat4RotationEuler,
  mat4Translation,
  vec3Add,
  vec3Multiply,
} from '../utils/math';

export interface Camera {
  readonly position: Vec3;
  readonly rotation: Vec3;
  readonly projection: Mat4;
  readonly view: Mat4;
}

export function cameraInit(position: Vec3, rotation: Vec3, projection: Mat4): Camera {
  return {
    position,
    rotation: rotation,
    projection: projection,
    view: mat4Multiply(
      mat4RotationEuler(rotation),
      mat4Translation(position)
    )
  };
}

export function cameraTranslate(camera: Camera, translation: Vec3) {
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

  return {
    position: nextPosition,
    rotation: camera.rotation,
    projection: camera.projection,
    view: mat4Multiply(
      rotationMatrix,
      mat4Translation(nextPosition)
    )
  }
}

export function cameraRotate(camera: Camera, rotation: Vec3) {
  const nextRotation = vec3Add(camera.rotation, rotation);

  return {
    position: camera.position,
    rotation: nextRotation,
    projection: camera.projection,
    view: mat4Multiply(
      mat4RotationEuler(nextRotation),
      mat4Translation(camera.position)
    )
  }
}
