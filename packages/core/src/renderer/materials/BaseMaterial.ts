import { FlatShader } from '../shaders/FlatShader';
import { Shader } from '../shaders/Shader';
import { BaseTexture } from '../textures/BaseTexture';
import { Material, TextureKey } from './Material';

export class BaseMaterial extends Material {
  constructor(shader: Shader = new FlatShader()) {
    super(shader, [.33, 0.33, 0.33, 1], 1, 1, [0, 0, 0], {
      [TextureKey.DIFFUSE]: new BaseTexture(),
    });
  }
}
