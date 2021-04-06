import { Fragment } from "./fragment"
import { RenderTarget } from "./rendertarget"

const VERSION = "dev"

interface RendererProps {
  autoClear: boolean
  autoUpdate: boolean
}

export class Renderer {
  width: number
  height: number
  mouse: Float32Array
  fragments: Fragment[]
  rendertargets: RenderTarget[]
  originalImageTexture: RenderTarget
  quadbuffer: WebGLBuffer
  currentrt: number
  loaded: number
  ready: boolean
  pause: boolean
  now: number
  gl: WebGLRenderingContext
  props: RendererProps = {
    autoClear: true,
    autoUpdate: false,
  }

  constructor(props = {} as Partial<RendererProps>) {
    Object.assign(this.props, props)

    // renderer dimensions
    this.width = 320
    this.height = 240

    // mouse position
    this.mouse = new Float32Array(2)

    // fragments & rendertargets
    this.fragments = []
    this.rendertargets = []

    // which rendertarget are we using
    this.currentrt = 0

    // how many fragments got loaded
    this.loaded = 0

    this.ready = false
    this.pause = false

    this.now = Date.now()

    if (window.WebGLRenderingContext) {
      this.init()
    } else {
      console.error("Your browser doesn't support WebGL")
    }
  }

  private onBlur = () => {
    this.pause = true
  }

  private onFocus = () => {
    this.pause = false
  }

  private onMove = (e: MouseEvent) => {
    this.mouse[0] = e.clientX
    this.mouse[1] = e.clientY
  }

  private useFragment(fragment: Fragment) {
    this.gl.useProgram(fragment.program)

    this.gl.enableVertexAttribArray(fragment.getAttribute(this.gl, "position"))
    this.gl.vertexAttribPointer(
      fragment.getAttribute(this.gl, "position"),
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    )

    fragment.setU2f(this.gl, "iResolution", this.width, this.height)
    fragment.setU1f(this.gl, "iTime", (Date.now() - this.now) / 1000)
    fragment.setU2fv(this.gl, "iMouse", this.mouse)
  }

  private init() {
    const canvas = document.createElement("canvas")
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.display = "block"
    document.body.appendChild(canvas)

    // window.addEventListener("blur", this.onBlur)
    // window.addEventListener("focus", this.onFocus)
    window.addEventListener("mousemove", this.onMove)

    this.gl = canvas.getContext("webgl")

    // this.gl.getExtension("EXT_color_buffer_float") // webgl2
    this.gl.getExtension("OES_texture_float")
    this.gl.getExtension("OES_standard_derivatives")
    this.gl.getExtension("OES_float_linear")
    this.gl.getExtension("OES_half_float_linear")

    if (!this.gl) {
      console.error("Couldn't start WebGL. Try get.webgl.org/troubleshooting")
    }

    var args = [
      `\n%cfragments%crenderer%c (${VERSION})\n`,
      "background: #00ffff; color: #1A1A1A; font-size: x-small;",
      "background: #1A1A1A; color: #00ffff; font-size: x-small;",
      "background: transparent; color: #999999; font-size: x-small;",
    ]

    console.log.apply(console, args)

    // create initial black texture which will be feed into the very first fragment
    this.originalImageTexture = new RenderTarget(this.gl, 512, 512, 0)

    // create 2 framebuffers so we can ping pong effects around
    const rt1 = new RenderTarget(this.gl, 512, 512, 1)
    const rt2 = new RenderTarget(this.gl, 512, 512, 2)
    this.rendertargets = [rt1, rt2]

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    this.quadbuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadbuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quad, this.gl.STATIC_DRAW)
  }

  public setSize(width: number, height: number) {
    this.width = width
    this.height = height

    this.gl.canvas.width = this.width
    this.gl.canvas.height = this.height

    this.gl.viewport(0, 0, this.width, this.height)

    this.originalImageTexture.setSize(this.gl, this.width, this.height)

    this.rendertargets.forEach((rt) => {
      rt.setSize(this.gl, this.width, this.height)
    })
  }

  // loads external fragment file.frag
  public loadFragment(url: string) {
    this.ready = false
    const index = this.fragments.length
    this.fragments.push(null)
    fetch(url)
      .then((e) => e.text())
      .then((raw) => this.raw(raw, index))
  }

  // adds a raw fragment to the renderer
  public raw(fragment: string, optionalIndex?: number) {
    this.ready = false

    const frag = new Fragment(this.gl, fragment)
    if (typeof optionalIndex === "number") {
      this.fragments[optionalIndex] = frag
    } else {
      this.fragments.push(frag)
    }
    this.loaded++

    if (this.fragments.length === this.loaded) {
      this.ready = true
    }
  }

  public clear(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.gl.clearColor(r, g, b, a)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  private getNext = (current: number) => {
    return (current + 1) % 2
  }

  public render() {
    if (this.ready !== true) return
    if (this.pause) return

    if (this.props.autoClear) {
      this.clear()
    }

    // start with the original image
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.originalImageTexture.fbo)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.originalImageTexture.texture)

    // loop through each effect we want to apply.
    for (let i = 0; i < this.fragments.length - 1; ++i) {
      // Setup to draw into one of the framebuffers.
      this.gl.bindFramebuffer(
        this.gl.FRAMEBUFFER,
        this.rendertargets[i % 2].fbo
      )
      this.useFragment(this.fragments[i])
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)

      // for the next draw, use the texture we just rendered to.
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendertargets[i % 2].texture)
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.useFragment(this.fragments[this.fragments.length - 1])
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
  }
}

/*
// THIS WORKS (1 shader rendering to screen)
// draw to texture
this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rendertargets[0].fbo)
this.useFragment(this.fragments[0])
this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)

// draw texture to screen
this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
this.gl.bindTexture(this.gl.TEXTURE_2D, this.rendertargets[0].texture)

this.useFragment(this.fragments[1])
this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
// this.rendertargets.reverse()
*/
