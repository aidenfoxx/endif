import { FlatShader } from '../shader/FlatShader';
import { Shader } from '../shader/Shader';
import { BaseTexture } from '../texture/BaseTexture';
import { Material, TextureKey } from './Material';

export class BaseMaterial extends Material {
  constructor(shader: Shader = new FlatShader()) {
    super(shader, [0.33, 0.33, 0.33, 0.33], 1, 1, [0, 0, 0], {
      [TextureKey.DIFFUSE]: new BaseTexture(),
    });
  }
}
