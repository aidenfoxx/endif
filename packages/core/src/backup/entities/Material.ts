import { Shader } from "./Shader";
import { Vec3, Vec4 } from "../utils/math";
import { TextureBuffer } from "./buffer/TextureBuffer";
import { generateID } from "../utils/generateID";

enum TextureKey {
  DIFFUSE,
  METALLIC_ROUGHNESS,
  NORMAL,
  OCCLUSION,
  EMISSIVE
}

interface MaterialTextures {
  [TextureKey.DIFFUSE]?: TextureBuffer;
  [TextureKey.METALLIC_ROUGHNESS]?: TextureBuffer;
  [TextureKey.NORMAL]?: TextureBuffer;
  [TextureKey.OCCLUSION]?: TextureBuffer;
  [TextureKey.EMISSIVE]?: TextureBuffer;
}

export class Material {
  private _cacheKey = generateID();

  constructor(
    private diffuseFactor: Vec4 = [1, 1, 1, 1],
    private metallicFactor: number = 1,
    private roughnessFactor: number = 1,
    private emissiveFactor: Vec3 = [0, 0, 0],
    private textures: MaterialTextures,
  ) {}

  public getDiffuseFactor(): Vec4 {
    return this.diffuseFactor;
  }

  public getMetallicFactor(): number {
    return this.metallicFactor;
  }

  public getRoughnessFactor(): number {
    return this.roughnessFactor;
  }

  public getEmissiveFactor(): Vec3 {
    return this.emissiveFactor;
  }

  public getTexture(key: TextureKey): TextureBuffer | undefined {
    return this.textures[key];
  }

  public setDiffuseFactor(diffuseFactor: Vec4): void {
    this.diffuseFactor = diffuseFactor;
    this._cacheKey = generateID();
  }

  public setMetallicFactor(metallicFactor: number): void {
    this.metallicFactor = metallicFactor;
    this._cacheKey = generateID();
  }

  public setRoughnessFactor(roughnessFactor: number): void {
    this.roughnessFactor = roughnessFactor;
    this._cacheKey = generateID();
  }

  public setEmissiveFactor(emissiveFactor: Vec3): void {
    this.emissiveFactor = emissiveFactor;
    this._cacheKey = generateID();
  }

  public setTexture(key: TextureKey, texture: TextureBuffer): void {
    this.textures[key] = texture;
    this._cacheKey = generateID();
  }

  public _cacheKey(): number {
    return this._cacheKey;
  }
}
