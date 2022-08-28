import { createUniformBuffer } from '../../utils/gl/buffer';
import { createTexture } from '../../utils/gl/texture';
import { Vec3, Vec4 } from '../../utils/math';
import { Context } from '../Context';
import { MATERIAL_BUFFER_INDEX, MATERIAL_BUFFER_SIZE } from '../Scene';
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

export class Material {
  public readonly textures: Readonly<MaterialTextures>

  private gl: WebGL2RenderingContext;

  private buffer?: WebGLBuffer;
  
  constructor(
    public readonly shader: Shader,
    public readonly diffuseFactor: Vec4 = [1, 1, 1, 1],
    public readonly metallicFactor: number = 1,
    public readonly roughnessFactor: number = 1,
    public readonly emissiveFactor: Vec3 = [0, 0, 0],
    textures: MaterialTextures
  ) {
    this.textures = { ...textures };
    this.gl = Context.getContent();
  }

  public setDiffuseFactor(diffuseFactor: Vec4): void {
    (this.diffuseFactor as Vec4) = diffuseFactor;

    this.gl.deleteBuffer(this.buffer ?? null);
    this.buffer = undefined; 
  }

  public setMetallicFactor(metallicFactor: number): void {
    (this.metallicFactor as number) = metallicFactor;

    this.gl.deleteBuffer(this.buffer ?? null);
    this.buffer = undefined; 
  }

  public setRoughnessFactor(roughnessFactor: number): void {
    (this.roughnessFactor as number) = roughnessFactor;

    this.gl.deleteBuffer(this.buffer ?? null);
    this.buffer = undefined; 
  }

  public setEmissiveFactor(emissiveFactor: Vec3): void {
    (this.emissiveFactor as Vec3) = emissiveFactor;

    this.gl.deleteBuffer(this.buffer ?? null);
    this.buffer = undefined; 
  }

  public setTexture(key: TextureKey, texture: Texture): void {
    (this.textures as MaterialTextures)[key] = texture;
  }

  public bind(): void {
    if (!this.buffer) {
      const buffer = createUniformBuffer(this.gl, MATERIAL_BUFFER_SIZE);

      this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, buffer);
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, new Float32Array(this.diffuseFactor));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 16, new Float32Array(this.metallicFactor));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 20, new Float32Array(this.roughnessFactor));
      this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 32, new Float32Array(this.emissiveFactor));

      this.buffer = buffer;
    }

    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, MATERIAL_BUFFER_INDEX, this.buffer);

    // Bind textures
    const textureKeys = Object.values(TextureKey).map(Number).filter(isFinite);

    for (const key of textureKeys) {
      this.gl.activeTexture(this.gl.TEXTURE0 + key);

      const texture = this.textures[key as TextureKey];

      if (!texture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        continue;
      }

      texture.bind();
    }
  }
}
