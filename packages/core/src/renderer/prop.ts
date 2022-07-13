import { Material } from '../entities/material';
import { Shader } from '../entities/shader';
import { Mesh } from '../entities/mesh';
import { Texture } from '../entities/texture';
import { AABB, aabbCalculate } from '../utils/math';

export interface Prop {
  meshRef: Mesh;
  materialRef: Material;
  textureRefs: PropTextures;
  shaderRefs: Array<Shader>;
  aabb: AABB;
}

export interface PropTextures {
  diffuseRef?: Texture;
  specularRef?: Texture;
  roughnessRef?: Texture;
  metallicRef?: Texture;
  normalRef?: Texture;
}

export function propInit(
  meshRef: Mesh,
  materialRef: Material,
  textureRefs: PropTextures = {}
): Prop {
  return {
    meshRef,
    materialRef,
    textureRefs,
    shaderRefs: [],
    aabb: aabbCalculate(meshRef.vertices),
  };
}

export function propAddShader(prop: Prop, shaderRef: Shader): void {
  prop.shaderRefs.push(shaderRef);
}
