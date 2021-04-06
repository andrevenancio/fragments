export class RenderTarget {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  level: number

  constructor(
    gl: WebGLRenderingContext,
    width: number,
    height: number,
    level: number
  ) {
    this.width = 1
    this.height = 1
    this.level = level

    this.texture = gl.createTexture()
    // gl.activeTexture(gl.TEXTURE0 + this.level)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    const internalFormat = gl.RGBA
    const border = 0
    const format = gl.RGBA
    const type = gl.UNSIGNED_BYTE
    const data = new Uint8Array([0, 255, 255, 255]) // null
    gl.texImage2D(
      gl.TEXTURE_2D,
      this.level,
      internalFormat,
      this.width,
      this.height,
      border,
      format,
      type,
      data
    )

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    this.fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      this.level
    )

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  setSize(gl: WebGLRenderingContext, width: number, height: number) {
    this.width = width
    this.height = height

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.width,
      this.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    )
    gl.bindTexture(gl.TEXTURE_2D, null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}
