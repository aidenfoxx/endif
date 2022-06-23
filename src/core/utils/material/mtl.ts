import { Material, materialInit } from '../../entities/material';
import { Vec3 } from '../../utils/math';
import { MtlParseException } from '../../expcetions';

// PBR reference: http://exocortex.com/blog/extending_wavefront_mtl_to_support_pbr
export function mtlParse(data: string): Material {
  const lines = data.split(/\r\n|\n/g);

  let diffuse: Vec3 | undefined;
  let specular: Vec3 | undefined;
  let roughness: Vec3 | undefined;
  let metallic: Vec3 | undefined;

  let diffuseMap;
  let specularMap;
  let roughnessMap;
  let metallicMap;
  let normalMap;

  // Parse mtl
  for (let i = 0; i < lines.length; i++) {
    const [definition, ...values] = lines[i].trim().split(/ +/);

    if (!values.length) {
      continue;
    }

    switch (definition.toLowerCase()) {
      case 'kd':
        diffuse = [Number(values[0]), Number(values[1]), Number(values[2])];
        break;

      case 'ks':
        specular = [Number(values[0]), Number(values[1]), Number(values[2])];
        break;

      case 'pr':
        roughness = [Number(values[0]), Number(values[1]), Number(values[2])];
        break;

      case 'pm':
        metallic = [Number(values[0]), Number(values[1]), Number(values[2])];
        break;

      case 'map_kd':
        diffuseMap = values[values.length - 1];
        break;

      case 'map_ks':
        specularMap = values[values.length - 1];
        break;

      case 'map_pr':
        roughnessMap = values[values.length - 1];
        break;

      case 'map_pm':
        metallicMap = values[values.length - 1];
        break;

      case 'norm':
        normalMap = values[values.length - 1];
        break;
    }
  }

  if (!diffuse) {
    throw new MtlParseException('No diffuse value defined');
  }

  return materialInit(diffuse, {
    specular,
    roughness,
    metallic
  }, {
    diffuseMap,
    specularMap,
    roughnessMap,
    metallicMap,
    normalMap
  });
}
