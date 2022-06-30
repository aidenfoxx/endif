import { Texture, TextureFormat } from '../../entities/texture';

function mapTextureFormat(gl: WebGL2RenderingContext, format: TextureFormat): [number, boolean] {
  const ext = gl.getExtension('WEBGL_compressed_texture_s3tc');

  if (!ext) {
    throw new Error('Target does not support compressed textures');
  }

  switch (format) {
    case TextureFormat.DXT1:
      return [ext.COMPRESSED_RGB_S3TC_DXT1_EXT, true];

    case TextureFormat.DXT1:
      return [ext.COMPRESSED_RGBA_S3TC_DXT3_EXT, true];

    case TextureFormat.DXT1:
      return [ext.COMPRESSED_RGBA_S3TC_DXT5_EXT, true];

    case TextureFormat.RGBA:
      return [gl.RGBA, false];

    case TextureFormat.RGB:
      return [gl.RGB, false];
  }

  throw new Error('Invalid texture format');
}

export function tboCreate(gl: WebGL2RenderingContext, texture: Texture): WebGLTexture {
  const [textureFormat, textureCompressed] = mapTextureFormat(gl, texture.format);

  if (textureCompressed && !texture.mipmaps.length) {
    throw new Error('Compressed texture missing mipmaps');
  }

  const tbo = gl.createTexture();

  if (!tbo) {
    throw new Error('Failed to create texture buffer');
  }

  gl.bindTexture(gl.TEXTURE_2D, tbo);

  let mipmapWidth = texture.width;
  let mipmapHeight = texture.height;

  for (let i = 0; i < texture.mipmaps.length + 1; i++) {
    const mipmapData = i ? texture.mipmaps[i - 1] : texture.data;

    if (textureCompressed) {
      gl.compressedTexImage2D(
        gl.TEXTURE_2D,
        i,
        textureFormat,
        mipmapWidth,
        mipmapHeight,
        0,
        mipmapData
      );
    } else {
      gl.texImage2D(
        gl.TEXTURE_2D,
        i,
        textureFormat,
        mipmapWidth,
        mipmapHeight,
        0,
        textureFormat,
        gl.UNSIGNED_BYTE,
        mipmapData
      );
    }

    mipmapWidth /= 2;
    mipmapHeight /= 2;
  }

  if (!texture.mipmaps.length) {
    console.warn('Texture missing mipmaps. Generating mipmaps');
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  gl.bindTexture(gl.TEXTURE_2D, null);

  return tbo;
}
