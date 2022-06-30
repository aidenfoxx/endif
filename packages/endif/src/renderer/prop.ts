import { MaterialRef, MeshRef, ShaderRef, TextureRef } from '../assets/loader';
import { AABB, aabbCalculate } from '../utils/math';

export interface Prop {
  meshRef: MeshRef;
  materialRef: MaterialRef;
  textureRefs: PropTextures;
  shaderRefs: Array<ShaderRef>;
  aabb: AABB;
}

export interface PropTextures {
  diffuseRef?: TextureRef;
  specularRef?: TextureRef;
  roughnessRef?: TextureRef;
  metallicRef?: TextureRef;
  normalRef?: TextureRef;
}

export function propInit(
  meshRef: MeshRef,
  materialRef: MaterialRef,
  textureRefs: PropTextures = {}
): Prop {
  return {
    meshRef,
    materialRef,
    textureRefs,
    shaderRefs: [],
    aabb: aabbCalculate(meshRef.mesh.vertices),
  };
}

export function propAddShader(prop: Prop, shaderRef: ShaderRef): void {
  prop.shaderRefs.push(shaderRef);
}
