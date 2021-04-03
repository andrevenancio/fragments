import { Fragment } from "./fragment"

export class Renderer {
  width: number
  height: number
  fragments: Fragment[]
  mouse: Float32Array
  ready: boolean
  pause: boolean
  gl: WebGLRenderingContext
  now: number

  constructor() {
    this.width = 320
    this.height = 240

    this.fragments = []

    this.mouse = new Float32Array(2)

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

    fragment.setU2f(this.gl, "uResolution", this.width, this.height)
    fragment.setU1f(this.gl, "uTime", (Date.now() - this.now) / 1000)
    fragment.setU2fv(this.gl, "uMouse", this.mouse)
  }

  private init() {
    const canvas = document.createElement("canvas")
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.display = "block"
    document.body.appendChild(canvas)

    window.addEventListener("blur", this.onBlur)
    window.addEventListener("focus", this.onFocus)
    window.addEventListener("mousemove", this.onMove)

    this.gl = canvas.getContext("webgl")

    this.gl.getExtension("OES_texture_float")
    this.gl.getExtension("OES_standard_derivatives")
    this.gl.getExtension("OES_float_linear")
    this.gl.getExtension("OES_half_float_linear")

    if (!this.gl) {
      console.error("Couldn't start WebGL. Try get.webgl.org/troubleshooting")
    }

    // quad
    const quad = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]); // prettier-ignore
    const buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quad, this.gl.STATIC_DRAW)
  }

  public setSize(width: number, height: number) {
    this.width = width
    this.height = height

    this.gl.canvas.width = this.width
    this.gl.canvas.height = this.height

    this.gl.viewport(0, 0, this.width, this.height)
  }

  // loads external fragment file.frag
  public loadFragment(url: string) {
    fetch(url)
      .then((e) => e.text())
      .then((raw) => this.raw(raw))
  }

  // adds a raw fragment to the renderer
  public raw(fragment: string) {
    this.ready = false
    this.fragments.push(new Fragment(this.gl, fragment))
    this.ready = true
  }

  public clear(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.gl.clearColor(r, g, b, a)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  public render() {
    if (this.ready !== true) return
    if (this.pause) return

    this.clear()

    for (let i = 0; i < this.fragments.length; i++) {
      this.useFragment(this.fragments[i])
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
  }
}
