import { Vec2 } from '../utils/math';

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
  readonly glyphs: ReadonlyMap<string, BitmapGlyph>;
}

export function bitmapFontInit(texture: string, glyphs: BitmapGlyph[]): BitmapFont {
  const mappedGlyphs: Map<string, BitmapGlyph> = new Map();

  for (let i = 0; i < glyphs.length; i++) {
    mappedGlyphs.set(glyphs[i].char, glyphs[i]);
  }

  return {
    texture,
    glyphs: mappedGlyphs
  };
}
