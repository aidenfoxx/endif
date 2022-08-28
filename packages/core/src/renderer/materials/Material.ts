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
  public readonly textures: Readonly<MaterialTextures>

  constructor(
    public readonly shader: Shader,
    public readonly diffuseFactor: Vec4 = [1, 1, 1, 1],
    public readonly metallicFactor: number = 1,
    public readonly roughnessFactor: number = 1,
    public readonly emissiveFactor: Vec3 = [0, 0, 0],
    textures: MaterialTextures
  ) {
    super();
    this.textures = { ...textures };
  }

  public setDiffuseFactor(diffuseFactor: Vec4): void {
    (this.diffuseFactor as Vec4) = diffuseFactor;
    this.updateState();
  }

  public setMetallicFactor(metallicFactor: number): void {
    (this.metallicFactor as number) = metallicFactor;
    this.updateState();
  }

  public setRoughnessFactor(roughnessFactor: number): void {
    (this.roughnessFactor as number) = roughnessFactor;
    this.updateState();
  }

  public setEmissiveFactor(emissiveFactor: Vec3): void {
    (this.emissiveFactor as Vec3) = emissiveFactor;
    this.updateState();
  }

  public setTexture(key: TextureKey, texture: Texture): void {
    (this.textures as MaterialTextures)[key] = texture;
    this.updateState();
  }
}
