import {
  BitmapFont, bitmapFontInit,
  BitmapGlyph
} from '../../entities/bitmapfont';
import { ParseException } from '../../expcetions';

export function fntParse(data: string): BitmapFont {
  const lines = data.split(/\r\n|\n/g);

  const glyphs: Array<BitmapGlyph> = [];
  const kernings: Map<string, Map<string, number>> = new Map();

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
            throw new ParseException('Multi-page fonts not supported');
          }

          const [key, value] = values[i].split('=');

          if (key.toLowerCase() === 'file') {
            texture = value.replace(/^"(.+)"$/, '$1');
          }
        }
        break;

      case 'char':
      case 'kerning':
        for (let i = 0; i < values.length; i++) {
          const [key, value] = values[i].split('=');

          switch (key.toLowerCase()) {
            case 'id':
            case 'first':
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

    // Create kerning store for glyph
    if (!kernings.get(char)) {
      kernings.set(char, new Map());
    }

    if (
      posX !== undefined &&
      posY !== undefined &&
      width !== undefined &&
      height !== undefined &&
      offsetX !== undefined &&
      offsetY !== undefined &&
      advanceX !== undefined
    ) {
      glyphs.push({
        char,
        position: [posX, posY],
        size: [width, height],
        offset: [offsetX, offsetY],
        advance: advanceX,
        kernings: kernings.get(char)!,
      });
    } else if (nextChar !== undefined && offsetX !== undefined) {
      kernings.get(char)!.set(nextChar, offsetX);
    }
  }

  if (!texture) {
    throw new ParseException('Font texture not defined');
  }

  return bitmapFontInit(texture, glyphs);
}
