import { PhongShader } from '../shaders/PhongShader';
import { Shader } from '../shaders/Shader';
import { SampleTexture } from '../textures/SampleTexture';
import { Material, TextureKey } from './Material';

export class SampleMaterial extends Material {
  constructor(shader: Shader = new PhongShader()) {
    super(shader, [0.5, 0.5, 0.5, 0.5], 1, 1, [0, 0, 0], {
      [TextureKey.DIFFUSE]: new SampleTexture(),
    });
  }
}
