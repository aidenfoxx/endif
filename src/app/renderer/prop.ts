import { AABB, aabbCalculate } from '../../core/utils/aabb';
import { MaterialRef, MeshRef, ShaderRef, TextureRef } from '../assets/loader';

export interface Prop {
  readonly meshRef: MeshRef;
  readonly materialRef: MaterialRef;
  readonly textureRefs: PropTextures;
  readonly shaderRefs: ReadonlyArray<ShaderRef>;
  readonly aabb: AABB;
}

export interface PropTextures {
  readonly diffuseRef?: TextureRef;
  readonly specularRef?: TextureRef;
  readonly roughnessRef?: TextureRef;
  readonly metallicRef?: TextureRef;
  readonly normalRef?: TextureRef;
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

export function propAddShader(prop: Prop, shaderRef: ShaderRef): Prop {
  return {
    ...prop,
    shaderRefs: [...prop.shaderRefs, shaderRef],
  };
}
