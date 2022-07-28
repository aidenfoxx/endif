import { Observable } from '../../reactor/Observable';
import { Vec3, Vec4 } from '../../utils/math';
import { Shader } from '../shaders/Shader';
import { Texture } from '../textures/Texture';

export enum TextureKey {
  DIFFUSE,
  METALLIC_ROUGHNESS,
  NORMAL,
  OCCLUSION,
  EMISSIVE,
}

export interface MaterialTextures {
  [TextureKey.DIFFUSE]?: Texture;
  [TextureKey.METALLIC_ROUGHNESS]?: Texture;
  [TextureKey.NORMAL]?: Texture;
  [TextureKey.OCCLUSION]?: Texture;
  [TextureKey.EMISSIVE]?: Texture;
}

export class Material extends Observable {
  constructor(
    public shader: Shader,
    public diffuseFactor: Vec4 = [1, 1, 1, 1],
    public metallicFactor: number = 1,
    public roughnessFactor: number = 1,
    public emissiveFactor: Vec3 = [0, 0, 0],
    public readonly textures: MaterialTextures
  ) {
    super();

    this.textures = { ...textures };

    this.watch(this, 'shader');
    this.watch(this, 'diffuseFactor');
    this.watch(this, 'metallicFactor');
    this.watch(this, 'roughnessFactor');
    this.watch(this, 'emissiveFactor');
    this.watch(this.textures, TextureKey.DIFFUSE);
    this.watch(this.textures, TextureKey.METALLIC_ROUGHNESS);
    this.watch(this.textures, TextureKey.OCCLUSION);
    this.watch(this.textures, TextureKey.EMISSIVE);
  }
}
