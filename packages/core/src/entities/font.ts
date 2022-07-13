import { Vec2 } from '../utils/math';
import { Mesh, meshInit } from './mesh';

export interface FontGlyph {
  char: string;
  position: Vec2;
  size: Vec2;
  offset: Vec2;
  advance: number;
  kernings: Map<string, number>;
}

export interface Font {
  texture: string;
  textureSize: Readonly<Vec2>;
  lineHeight: number;
  glyphs: Map<string, FontGlyph>;
}

export function fontInit(
  lineHeight: number,
  texture: string,
  textureSize: Readonly<Vec2>,
  glyphs: Array<FontGlyph>
): Font {
  return {
    texture,
    textureSize: [...textureSize],
    lineHeight,
    glyphs: new Map(
      glyphs.map(glyph => [glyph.char, { ...glyph }])
    )
  };
}

export function bitmapFontGenerateMesh(gl: WebGL2RenderingContext, font: Font, input: string): Mesh {
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

    const left = (offsetX + charOffset) / font.lineHeight;
    const right = left + width / font.lineHeight;
    const top = (offsetY + lineOffest) / font.lineHeight;
    const bottom = top + height / font.lineHeight;

    vertices.push(left, -top, 0);
    vertices.push(left, -bottom, 0);
    vertices.push(right, -bottom, 0);
    vertices.push(right, -top, 0);

    // Map texture to relative position
    const [positonX, positionY] = glyph.position;

    const textureLeft = positonX / textureWidth;
    const textureRight = textureLeft + width / textureWidth;
    const textureTop = positionY / textureHeight;
    const textureBottom = textureTop + height / textureHeight;

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

  return meshInit(gl, vertices, uvs, [], indices);
}
