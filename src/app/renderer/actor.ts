import { AABB, aabbTransform } from '../../core/utils/aabb';
import {
  Mat4,
  mat4Multiply,
  mat4RotationEuler,
  mat4Scale,
  mat4Translation,
  Vec3
} from '../../core/utils/math';
import { Prop } from './prop';

export interface Actor {
  prop: Prop;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  model: Mat4;
  aabb: AABB;
}

function calculateModelMatrix(position: Vec3, rotation: Vec3, scale: Vec3): Mat4 {
  return mat4Multiply(
    mat4Multiply(mat4Translation(position), mat4RotationEuler(rotation)),
    mat4Scale(scale)
  );
}

export function actorInit(prop: Prop, position: Vec3, rotation: Vec3, scale: Vec3): Actor {
  const model = calculateModelMatrix(position, rotation, scale);

  return {
    prop,
    position,
    rotation,
    scale,
    model,
    aabb: aabbTransform(prop.aabb, model),
  };
}

export function actorSetPosition(actor: Actor, position: Vec3): void {
  const model = calculateModelMatrix(position, actor.rotation, actor.scale);

  actor.position = position;
  actor.model = model;
  actor.aabb = aabbTransform(actor.prop.aabb, model);
}

export function actorSetRotation(actor: Actor, rotation: Vec3): void {
  const model = calculateModelMatrix(actor.position, rotation, actor.scale);

  actor.rotation = rotation;
  actor.model = model;
  actor.aabb = aabbTransform(actor.prop.aabb, model);
}

export function actorSetScale(actor: Actor, scale: Vec3): void {
  const model = calculateModelMatrix(actor.position, actor.scale, scale);

  actor.scale = scale;
  actor.model = model;
  actor.aabb = aabbTransform(actor.prop.aabb, model);
}
