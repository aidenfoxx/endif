import { Shader } from "../renderer/Shader";
import { Vec3, Vec4 } from "../utils/math";
import { Texture } from "./Texture";

export class Material {
  public diffuseTexture?: Texture;
  public metallicRoughnessTexture?: Texture;
  public normalTexture?: Texture;
  public occlusionTexture?: Texture;
  public emissiveTexture?: Texture;
  public emissiveFactor?: Vec3;
  
  constructor(
    public shader: Shader,
    public diffuseFactor: Vec4 = [1, 1, 1, 1],
    public metallicFactor: number = 1,
    public roughnessFactor: number = 1
  ) {}
}