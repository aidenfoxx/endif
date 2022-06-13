import { Vec3 } from '../utils/math';

export interface MaterialValues {
  readonly specular?: Vec3;
  readonly roughness?: Vec3;
  readonly metallic?: Vec3;
}

export interface MaterialTextures {
  readonly diffuseMap?: string;
  readonly specularMap?: string;
  readonly roughnessMap?: string;
  readonly metallicMap?: string;
  readonly normalMap?: string;
}

export interface Material extends MaterialValues, MaterialTextures {
  readonly diffuse: Vec3;
}

export function materialInit(
  diffuse: Vec3,
  values?: Partial<MaterialValues>,
  textures?: Partial<MaterialTextures>
): Material {
  const materialValues = values ?? {};
  const materialTextures = textures ?? {};

  return {
    diffuse,
    ...materialValues,
    ...materialTextures
  }
}
