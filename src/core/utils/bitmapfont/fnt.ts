import { BitmapFont, bitmapFontInit, BitmapGlyph } from '../../entities/bitmapfont';
import { ParseException } from '../../expcetions';

export function fntParse(data: string): BitmapFont {
  const lines = data.split(/\r\n|\n/g);

  const glyphs: Array<BitmapGlyph> = [];
  const kernings: Map<string, Map<string, number>> = new Map();

  let lineHeight;
  let textureWidth;
  let textureHeight;
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
    let nextChar;
    let advanceX;

    switch (definition.toLowerCase()) {
      case 'common':
        for (let i = 0; i < values.length; i++) {
          const [key, value] = values[i].split('=');

          switch (key.toLowerCase()) {
            case 'lineheight':
              lineHeight = Number(value);
              break;

            case 'pages':
              if (value !== '1') {
                throw new ParseException('Multi-page fonts not supported');
              }
              break;

            case 'scalew':
              textureWidth = Number(value);
              break;

            case 'scaleh':
              textureHeight = Number(value);
              break;
          }
        }
        break;

      case 'page':
        for (let i = 0; i < values.length; i++) {
          const [key, value] = values[i].split('=');

          if (key.toLowerCase() === 'file') {
            texture = value?.replace(/^"(.+)"$/, '$1');
          }
        }
        break;

      case 'char':
        for (let i = 0; i < values.length; i++) {
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
          }
        }
        break;

      case 'kerning':
        for (let i = 0; i < values.length; i++) {
          const [key, value] = values[i].split('=');

          switch (key.toLowerCase()) {
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

  if (
    texture === undefined ||
    textureWidth === undefined ||
    textureHeight === undefined ||
    lineHeight === undefined
  ) {
    throw new ParseException('Font meta not defined');
  }

  return bitmapFontInit(texture, [textureWidth, textureHeight], lineHeight, glyphs);
}
