import { Texture, TextureFormat } from '../../core/entities/texture';
import { ddsParse } from '../../core/utils/texture/dds';
import { tgaParse } from '../../core/utils/texture/tga';
import { RefCounter } from '../types';
import { resolvePath } from '../utils/resolve-path';

export interface TextureRef {
  readonly path: string;
  readonly tbo: WebGLTexture;
  readonly texture: Texture;
}

const EXTENSION_DDS = 'dds';
const EXTENSION_TGA = 'tga';

const _textureCache: Map<string, RefCounter<TextureRef>> = new Map();

function _mapTextureFormat(gl: WebGL2RenderingContext, format: TextureFormat): number {
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

  const refCounter = _textureCache.get(path);

  if (refCounter) {
    refCounter.refs++;
    return refCounter.resource;
  }

  const extension = path.split('.').pop();

  let texture;

  // Parse texture data
  switch (extension) {
    case EXTENSION_DDS: {
      const response = await fetch(path);
      texture = ddsParse(await response.arrayBuffer());
      break;
    }

    case EXTENSION_TGA: {
      const response = await fetch(path);
      texture = tgaParse(await response.arrayBuffer());
      break;
    }

    default:
      throw new Error(`Unsupported texture format: ${extension}`);
  }

  // Bind texture
  const buffer = gl.createTexture();

  if (!buffer) {
    throw new Error('Failed to create texture buffer');
  }

  gl.bindTexture(gl.TEXTURE_2D, buffer);

  const isCompressed = texture.format === TextureFormat.DXT1 || texture.format === TextureFormat.DXT3 || texture.format === TextureFormat.DXT5;
  const glTextureFormat = _mapTextureFormat(gl, texture.format);

  if (isCompressed) {
    gl.compressedTexImage2D(gl.TEXTURE_2D, 0, glTextureFormat, texture.width, texture.height, 0, texture.data);

    if (!texture.mipmaps.length) {
      throw new Error(`Compressed texture mipmaps missing: ${path}`);
    }
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, glTextureFormat, texture.width, texture.height, 0, glTextureFormat, gl.UNSIGNED_BYTE, texture.data);

    if (!texture.mipmaps.length) {
      console.warn(`Texture mipmaps missing. Generating mipmaps: ${path}`);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  }

  // Bind mipmaps
  let mipmapWidth = texture.width / 2;
  let mipmapHeight = texture.height / 2;

  for (let i = 0; i < texture.mipmaps.length; i++) {
    if (isCompressed) {
      gl.compressedTexImage2D(gl.TEXTURE_2D, i + 1, glTextureFormat, mipmapWidth, mipmapHeight, 0, texture.mipmaps[i]);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, i + 1, glTextureFormat, mipmapWidth, mipmapHeight, 0, glTextureFormat, gl.UNSIGNED_BYTE, texture.mipmaps[i]);
    }

    mipmapWidth /= 2;
    mipmapHeight /= 2;
  }

  gl.bindTexture(gl.TEXTURE_2D, null);

  // Cache and return asset
  const textureRef = { path, texture, tbo: buffer };

  _textureCache.set(path, { refs: 1, resource: textureRef });

  return textureRef;
}

export function textureDestroy(gl: WebGL2RenderingContext, textureRef: TextureRef): void {
  const { path } = textureRef;
  const refCounter = _textureCache.get(path);

  if (!refCounter) {
    console.warn(`Texture could not be destroyed. Not defined: ${path}`);
    return;
  }

  if (refCounter.refs === 1) {
    gl.deleteTexture(refCounter.resource.texture);
    _textureCache.delete(path);
  } else {
    refCounter.refs--;
  }
}
