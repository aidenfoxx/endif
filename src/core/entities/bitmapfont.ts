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

export function bitmapFontInit(texture: string): BitmapFont {
  return {
    texture,
    glyphs: new Map(),
  };
}

export function bitmapFontAddGlyph(font: BitmapFont, glyph: BitmapGlyph): BitmapFont {
  const nextGlyphs = new Map(font.glyphs);
  nextGlyphs.set(glyph.char, glyph);

  return {
    ...font,
    glyphs: nextGlyphs,
  };
}
