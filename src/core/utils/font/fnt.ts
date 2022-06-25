import { BitmapFont, bitmapFontAddGlyph, bitmapFontInit, BitmapGlyph } from '../../entities/bitmapfont';
import { FntParseException } from '../../expcetions';

export function fntParse(data: string): BitmapFont {
  const lines = data.split(/\r\n|\n/g);

  const chars: Array<BitmapGlyph> = [];
  const glyphs: Map<string, Map<string, number>> = new Map();

  let texture;

  // Parse fnt
  for (let i = 0; i < lines.length; i++) {
    const [definition, ...values] = lines[i].trim().split(/ +/);

    if (!values.length) {
      continue;
    }

    let char;
    let posX;
    let posY;
    let width;
    let height;
    let offsetX;
    let offsetY;
    let advanceX;
    let nextChar;

    switch (definition.toLowerCase()) {
      case 'page':
        for (let i = 1; i < values.length; i++) {
          if (texture) {
            throw new FntParseException('Multi-page fonts not supported');
          }

          const [key, value] = values[i].split('=');

          if (key.toLowerCase() === 'file') {
            texture = value;
          }
        }
        break;

      case 'char':
      case 'kerning':
        for (let i = 1; i < values.length; i++) {
          const [key, value] = values[i].split('=');

          switch (key.toLowerCase()) {
            case 'id':
              char = String.fromCharCode(Number(value));
              break;

            case 'x':
              posX = Number(value);
              break;

            case 'y':
              posY = Number(value);
              break;

            case 'width':
              width = Number(value);
              break;

            case 'height':
              height = Number(value);
              break;

            case 'xoffset':
              offsetX = Number(value);
              break;

            case 'yoffset':
              offsetY = Number(value);
              break;

            case 'xadvance':
              advanceX = Number(value);
              break;

            case 'first':
              char = String.fromCharCode(Number(value));
              break;

            case 'second':
              nextChar = String.fromCharCode(Number(value));
              break;

            case 'amount':
              offsetX = Number(value);
              break;
          }
        }
        break;
    }

    if (char === undefined) {
      continue;
    }

    // Create glyph store for character
    if (!glyphs.get(char)) {
      glyphs.set(char, new Map());
    }

    if (
      char !== undefined &&
      posX !== undefined &&
      posY !== undefined &&
      width !== undefined &&
      height !== undefined &&
      offsetX !== undefined &&
      offsetY !== undefined &&
      advanceX !== undefined
    ) {
      chars.push({
        char,
        position: [posX, posY],
        size: [width, height],
        offset: [offsetX, offsetY],
        advance: advanceX,
        kernings: glyphs.get(char)!
      });
    } else if (
      char !== undefined &&
      nextChar !== undefined &&
      offsetX !== undefined
    ) {
      glyphs.get(char)!.set(nextChar, offsetX);
    }
  }

  if (!texture) {
    throw new FntParseException('Font texture not defined');
  }

  const font = bitmapFontInit(texture);

  for (let i = 0; i < chars.length; i++) {
    bitmapFontAddGlyph(font, chars[i]);
  }

  return font;
}
