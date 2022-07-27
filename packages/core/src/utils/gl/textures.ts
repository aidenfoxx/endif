export function createTexture(gl: WebGL2RenderingContext, image: ImageBitmap): WebGLTexture {
  const buffer = gl.createTexture();

  if (!buffer) {
    throw new Error('Failed to create texture buffer');
  }

  gl.bindTexture(gl.TEXTURE_2D, buffer);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return buffer;
}
