export function createTexture(
  gl: WebGL2RenderingContext,
  image: ImageBitmap,
  mipmaps: Array<ImageBitmap> = []
): WebGLTexture {
  const texture = gl.createTexture();

  if (!texture) {
      throw new Error('Failed to create texture buffer');
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  for (let i = 0; i < mipmaps.length; i++) {
      gl.texImage2D(gl.TEXTURE_2D, i + 1, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mipmaps[i]);
  }

  if (!mipmaps.length) {
      gl.generateMipmap(gl.TEXTURE_2D);
  }

  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}
