import { Vec2 } from '../utils/math';
import { Mesh, meshInit } from './mesh';

export interface BitmapGlyph {
  readonly char: string;
  readonly position: Vec2;
  readonly size: Vec2;
  readonly offset: Vec2;
  readonly advance: number;
  readonly kernings: ReadonlyMap<string, number>;
}

export interface BitmapFont {
  readonly texture: string;
  readonly textureSize: Vec2;
  readonly lineHeight: number;
  readonly glyphs: ReadonlyMap<string, BitmapGlyph>;
}

export function bitmapFontInit(
  texture: string,
  textureSize: Vec2,
  lineHeight: number,
  glyphs: BitmapGlyph[]
): BitmapFont {
  const mappedGlyphs: Map<string, BitmapGlyph> = new Map();

  for (let i = 0; i < glyphs.length; i++) {
    mappedGlyphs.set(glyphs[i].char, glyphs[i]);
  }

  return {
    texture,
    textureSize,
    lineHeight,
    glyphs: mappedGlyphs,
  };
}

export function bitmapFontGenerateMesh(font: BitmapFont, input: string): Mesh {
  const chars = input.split('');

  const [textureWidth, textureHeight] = font.textureSize;

  const vertices = [];
  const uvs = [];
  const indices = [];

  let charOffset = 0;
  let lineOffest = 0;
  let indexOffset = 0;

  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === '\n') {
      charOffset = 0;
      lineOffest += font.lineHeight;
      continue;
    }

    const glyph = font.glyphs.get(chars[i]);

    if (!glyph) {
      continue;
    }

    // Map to vertices to relative position
    const [offsetX, offsetY] = glyph.offset;
    const [width, height] = glyph.size;

    const top = (offsetY + lineOffest) / font.lineHeight;
    const left = (offsetX + charOffset) / font.lineHeight;
    const bottom = top + (height / font.lineHeight);
    const right = left + (width / font.lineHeight);

    vertices.push(left, -top, 0);
    vertices.push(left, -bottom, 0);
    vertices.push(right, -bottom, 0);
    vertices.push(right, -top, 0);

    // Map texture to relative position
    const [positonX, positionY] = glyph.position;

    const textureTop = positionY / textureHeight;
    const textureLeft = positonX / textureWidth;
    const textureBottom = textureTop + (height / textureHeight);
    const textureRight = textureLeft + (width / textureWidth);

    uvs.push(textureLeft, textureTop);
    uvs.push(textureLeft, textureBottom);
    uvs.push(textureRight, textureBottom);
    uvs.push(textureRight, textureTop);

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

  return meshInit(vertices, uvs, [], indices);
}
