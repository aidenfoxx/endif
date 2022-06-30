import { Vec3 } from '../utils/math';

export interface MaterialValues {
  specular?: Vec3;
  roughness?: Vec3;
  metallic?: Vec3;
}

export interface MaterialTextures {
  diffuseMap?: string;
  specularMap?: string;
  roughnessMap?: string;
  metallicMap?: string;
  normalMap?: string;
}

export interface Material extends MaterialValues, MaterialTextures {
  diffuse: Vec3;
}

export function materialInit(
  diffuse: Readonly<Vec3>,
  values: Readonly<MaterialValues> = {},
  textures: Readonly<MaterialTextures> = {}
): Material {
  return {
    diffuse: [...diffuse],
    ...values,
    ...textures,
  };
}
