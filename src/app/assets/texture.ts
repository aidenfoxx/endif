import { Texture, TextureFormat } from '../../core/entities/texture';
import { ddsParse } from '../../core/utils/texture/dds';
import { tgaParse } from '../../core/utils/texture/tga';
import { RefCounter } from '../types';
import { Extensions } from '../utils/extensions';
import { resolvePath } from '../utils/resolve-path';

export interface TextureRef {
  readonly path: string;
  readonly tbo: WebGLTexture;
  readonly texture: Texture;
}

const textureCache: Map<string, RefCounter<TextureRef>> = new Map();

function mapTextureFormat(gl: WebGL2RenderingContext, format: TextureFormat): number {
  const ext = gl.getExtension('WEBGL_compressed_texture_s3tc');

  if (!ext) {
    throw new Error('Target does not support compressed textures');
  }

  switch (format) {
    case TextureFormat.DXT1:
      return ext.COMPRESSED_RGBA_S3TC_DXT1_EXT;

    case TextureFormat.DXT1:
      return ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;

    case TextureFormat.DXT1:
      return ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;

    case TextureFormat.RGBA:
      return gl.RGBA;

    case TextureFormat.RGB:
      return gl.RGB;
  }

  throw new Error('Invalid texture format');
}

export async function textureFetch(gl: WebGL2RenderingContext, path: string): Promise<TextureRef> {
  path = resolvePath(path);

  const refCounter = textureCache.get(path);

  // Return from cache
  if (refCounter) {
    refCounter.refs++;
    return refCounter.resource;
  }

  // Parse texture
  const extension = path.split('.').pop()?.toLowerCase();

  let texture;

  switch (extension) {
    case Extensions.DDS: {
      const response = await fetch(path);
      texture = ddsParse(await response.arrayBuffer());
      break;
    }

    case Extensions.TGA: {
      const response = await fetch(path);
      texture = tgaParse(await response.arrayBuffer());
      break;
    }

    default:
      throw new Error(`Unsupported texture format: ${extension}`);
  }

  const buffer = gl.createTexture();

  if (!buffer) {
    throw new Error('Failed to create texture buffer');
  }

  gl.bindTexture(gl.TEXTURE_2D, buffer);

  const isCompressed =
    texture.format === TextureFormat.DXT1 ||
    texture.format === TextureFormat.DXT3 ||
    texture.format === TextureFormat.DXT5;

  if (isCompressed && !texture.mipmaps.length) {
    throw new Error('Compressed texture missing mipmaps');
  }

  const textureFormat = mapTextureFormat(gl, texture.format);

  let textureWidth = texture.width;
  let textureHeight = texture.height;

  // Map texture and mipmaps
  for (let i = 0; i < texture.mipmaps.length + 1; i++) {
    const textureData = i ? texture.mipmaps[i - 1] : texture.data;

    if (isCompressed) {
      gl.compressedTexImage2D(
        gl.TEXTURE_2D,
        i,
        textureFormat,
        textureWidth,
        textureHeight,
        0,
        textureData
      );
    } else {
      gl.texImage2D(
        gl.TEXTURE_2D,
        i,
        textureFormat,
        textureWidth,
        textureHeight,
        0,
        textureFormat,
        gl.UNSIGNED_BYTE,
        textureData
      );
    }

    textureWidth /= 2;
    textureHeight /= 2;
  }

  if (!texture.mipmaps.length) {
    gl.generateMipmap(gl.TEXTURE_2D);
    console.warn('Texture missing mipmaps. Generating mipmaps');
  }

  gl.bindTexture(gl.TEXTURE_2D, null);

  // Cache and return
  const textureRef = { path, texture, tbo: buffer };

  textureCache.set(path, { refs: 1, resource: textureRef });

  return textureRef;
}

export function textureDestroy(gl: WebGL2RenderingContext, textureRef: TextureRef): void {
  const { path } = textureRef;
  const refCounter = textureCache.get(path);

  if (!refCounter) {
    console.warn('Texture could not be destroyed. Not defined');
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteTexture(refCounter.resource.texture);
    textureCache.delete(path);
  } else {
    refCounter.refs--;
  }
}
