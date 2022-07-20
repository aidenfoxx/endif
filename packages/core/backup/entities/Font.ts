import { Vec2 } from '../utils/math';
import { Material } from './Material';
import { Mesh } from './Mesh';
import { Texture } from './Texture';
import { TextureSampler } from './TextureSampler';

export class FontGlyph {
  public char: Readonly<string>;

  public width: Readonly<number>;

  public height: Readonly<number>;

  public offset: Readonly<Vec2>;

  public uv: Readonly<Vec2>;

  public advance: Readonly<number>;

  public kernings: ReadonlyMap<string, number>;

  constructor(
    char: string,
    width: number,
    height: number,
    offset: Vec2,
    uv: Vec2,
    advance: number = 0,
    kernings: Map<string, number> = new Map()
  ) {
    this.char = char;
    this.width = width;
    this.height = height;
    this.offset = offset;
    this.uv = uv
    this.advance = advance;
    this.kernings = new Map(kernings)
  }
}

export class Font {
  private material: Material;

  private textureWidth: number;

  private textureHeight: number;

  private lineHeight: number;

  private glyphs: Map<string, FontGlyph>;

  constructor(
    texture: Texture,
    textureWidth: number,
    textureHeight: number,
    lineHeight: number,
    glyphs: Array<FontGlyph>
  ) {
    this.material = new Material([0, 0, 0, 0], 0, 0, { diffuseTexture: new TextureSampler(texture) });
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;
    this.lineHeight = lineHeight;
    this.glyphs = new Map(glyphs.map(glyph => [glyph.char, { ...glyph }]))
  }

  public generateFontMesh(input: string) {
    const chars = input.split('');
  
    const vertices = [];
    const uvs = [];
    const indices = [];
  
    let charOffset = 0;
    let lineOffest = 0;
    let indexOffset = 0;
  
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === '\n') {
        charOffset = 0;
        lineOffest += this.lineHeight;
        continue;
      }
  
      const glyph = this.glyphs.get(chars[i]);
  
      if (!glyph) {
        continue;
      }
  
      // Map to vertices to relative position
      const [offsetX, offsetY] = glyph.offset;
  
      const left = (offsetX + charOffset) / this.lineHeight;
      const right = left + glyph.width / this.lineHeight;
      const top = (offsetY + lineOffest) / this.lineHeight;
      const bottom = top + glyph.height / this.lineHeight;
  
      vertices.push(left, -top, 0);
      vertices.push(left, -bottom, 0);
      vertices.push(right, -bottom, 0);
      vertices.push(right, -top, 0);
  
      // Map texture to relative position
      const [textureX, textureY] = glyph.uv;
  
      const textureLeft = textureX / this.textureWidth;
      const textureRight = textureLeft + glyph.width / this.textureWidth;
      const textureTop = textureY / this.textureHeight;
      const textureBottom = textureTop + glyph.height / this.textureHeight;
  
      uvs.push(textureLeft, -textureTop);
      uvs.push(textureLeft, -textureBottom);
      uvs.push(textureRight, -textureBottom);
      uvs.push(textureRight, -textureTop);
  
      indices.push(
        indexOffset,
        indexOffset + 1,
        indexOffset + 3,
        indexOffset + 1,
        indexOffset + 2,
        indexOffset + 3
      );
  
      indexOffset += 4;
  
      // Apply kerning to next character
      const kerning = glyph.kernings.get(chars[i + 1]) ?? 0;
  
      charOffset += glyph.advance + kerning;
    }

    return new Mesh(
      this.material,
      new Float32Array(vertices),
      new Float32Array(uvs),
      undefined,
      new Uint16Array(indices)
    );
  }
}
