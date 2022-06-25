import { Prop } from './prop';
import {
  Mat4,
  mat4Multiply,
  mat4RotationEuler,
  mat4Scale,
  mat4Translation,
  Vec3
} from '../../core/utils/math';
import { AABB, aabbTransform } from '../../core/utils/aabb';

export interface Actor {
  readonly prop: Prop;
  readonly position: Vec3;
  readonly rotation: Vec3;
  readonly scale: Vec3;
  readonly model: Mat4;
  readonly aabb: AABB;
}

function calculateModelMatrix(position: Vec3, rotation: Vec3, scale: Vec3): Mat4 {
  return mat4Multiply(
    mat4Multiply(
      mat4Scale(scale),
      mat4RotationEuler(rotation),
    ),
    mat4Translation(position)
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
    aabb: aabbTransform(prop.aabb, model)
  };
}

export function actorSetPosition(actor: Actor, position: Vec3): Actor {
  const model = calculateModelMatrix(position, actor.rotation, actor.scale);

  return {
    ...actor,
    position,
    model,
    aabb: aabbTransform(actor.prop.aabb, model)
  };
}

export function actorSetRotation(actor: Actor, rotation: Vec3): Actor {
  const model = calculateModelMatrix(actor.position, rotation, actor.scale);

  return {
    ...actor,
    rotation,
    model,
    aabb: aabbTransform(actor.prop.aabb, model)
  };
}

export function actorSetScale(actor: Actor, scale: Vec3): Actor {
  const model = calculateModelMatrix(actor.position, actor.scale, scale);

  return {
    ...actor,
    scale,
    model,
    aabb: aabbTransform(actor.prop.aabb, model)
  };
}
