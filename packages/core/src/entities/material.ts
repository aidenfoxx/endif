import { Shader } from "./Shader";
import { Vec3, Vec4 } from "../utils/math";
import { Texture } from "./Texture";

export class Material {
  public diffuseFactor: Vec4 = [1, 1, 1, 1]; // TODO: Should these be editable? Harder to keep UBO for material
  public metallicFactor: number = 1;
  public roughnessFactor: number = 1;
  public diffuseTexture?: Texture;
  public metallicRoughnessTexture?: Texture;
  public normalTexture?: Texture;
  public occlusionTexture?: Texture;
  public emissiveTexture?: Texture;
  public emissiveFactor?: Vec3;
  
  constructor(public readonly shader: Shader) {}
}
