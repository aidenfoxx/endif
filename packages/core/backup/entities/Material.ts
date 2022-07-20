import { Vec3, Vec4 } from '../utils/math';
import { TextureSampler } from './TextureSampler';

export interface MaterialTextures {
  diffuseTexture?: TextureSampler;
  metallicRoughnessTexture?: TextureSampler;
  normalTexture?: TextureSampler;
  occlusionTexture?: TextureSampler;
  emissiveTexture?: TextureSampler;
  emissiveColor?: Vec3;
}

// TODO: Generate UBO
// Reference: https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#reference-material
export class Material implements Readonly<MaterialTextures> {
  public readonly diffuseColor: Vec4;
  
  public readonly metallicFactor: number;

  public readonly roughnessFactor: number;

  public readonly diffuseTexture?: TextureSampler;

  public readonly metallicRoughnessTexture?: TextureSampler;

  public readonly normalTexture?: TextureSampler;

  public readonly occlusionTexture?: TextureSampler;

  public readonly emissiveTexture?: TextureSampler;

  public readonly emissiveColor?: Vec3;

  private uniformCache: Map<WebGL2RenderingContext, WebGLBuffer> = new Map();

  constructor(
    diffuseColor: Vec4,
    metallicFactor: number = 1,
    roughnessFactor: number = 1,
    textures?: MaterialTextures
  ) {

    this.diffuseColor = diffuseColor;
    this.metallicFactor = metallicFactor;
    this.roughnessFactor = roughnessFactor;
    
    Object.assign(this, textures ?? {});
  }

  public async bind(gl: WebGL2RenderingContext): Promise<void> {

  }
}
